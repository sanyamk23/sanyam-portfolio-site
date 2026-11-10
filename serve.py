#!/usr/bin/env python3
import http.server
import os
import posixpath
import socketserver
import sys
import urllib.parse
from pathlib import Path

ROOT = Path(__file__).resolve().parent

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def log_message(self, fmt, *args):
        # keep logs concise
        sys.stderr.write("%s - - [%s] %s\n" % (self.client_address[0], self.log_date_time_string(), fmt % args))

    def _rsc_file_for(self, url_path: str):
        # url_path is path without query, starts with /
        p = url_path
        if p.endswith('/index.html'):
            p = p[: -len('/index.html')] or '/'
        p = p.rstrip('/') or '/'
        if p == '/':
            cand = ROOT / 'index.rsc'
        else:
            cand = ROOT / (p.lstrip('/') + '.rsc')
        return cand if cand.is_file() else None

    def do_HEAD(self):
        self._handle(send_body=False)

    def do_GET(self):
        self._handle(send_body=True)

    def _handle(self, send_body=True):
        parsed = urllib.parse.urlsplit(self.path)
        qs = urllib.parse.parse_qs(parsed.query, keep_blank_values=True)
        url_path = urllib.parse.unquote(parsed.path)

        # Serve RSC flight payloads for App Router prefetch/data requests
        if '_rsc' in qs:
            rsc = self._rsc_file_for(url_path)
            if rsc is not None:
                try:
                    data = rsc.read_bytes()
                except OSError:
                    self.send_error(404, 'RSC payload not found')
                    return
                self.send_response(200)
                self.send_header('Content-Type', 'text/x-component')
                self.send_header('Content-Length', str(len(data)))
                self.send_header('Cache-Control', 'no-store')
                # Vary-like hints aren't required locally but harmless
                self.end_headers()
                if send_body:
                    self.wfile.write(data)
                return
            # fall through to normal handling if no .rsc available

        # For normal requests, avoid SimpleHTTPRequestHandler's directory redirect
        # ( /vault -> /vault/ ) so query strings aren't awkward; serve index.html directly.
        if not ('_rsc' in qs):
            # normalize local path
            fs_path = self.translate_path(url_path)
            if os.path.isdir(fs_path):
                for index in ('index.html', 'index.htm'):
                    index_path = os.path.join(fs_path, index)
                    if os.path.isfile(index_path):
                        # serve the index file by rewriting path component
                        if not parsed.path.endswith('/'):
                            # but keep URL as-is for client; just serve file
                            pass
                        self.path = urllib.parse.urlunsplit(('', '', parsed.path.rstrip('/') + '/' + index, parsed.query, parsed.fragment))
                        break
        return super().do_GET() if send_body else super().do_HEAD()


def main():
    port = int(sys.argv[1]) if len(sys.argv) > 1 else int(os.environ.get('PORT', 8765))
    host = os.environ.get('HOST', '0.0.0.0' if os.environ.get('PORT') else '127.0.0.1')
    socketserver.ThreadingTCPServer.allow_reuse_address = True
    with socketserver.ThreadingTCPServer((host, port), Handler) as httpd:
        print(f'serving {ROOT} at http://{host}:{port}', flush=True)
        httpd.serve_forever()

if __name__ == '__main__':
    main()

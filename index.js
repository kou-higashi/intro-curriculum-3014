'use strict';
const http = require('http');
const server = http
  .createServer((req, res) => {
    const now = new Date();
    console.info('[' + now + '] Requested by ' + req.socket.remoteAddress);
    res.writeHead(200, {
      'Content-Type': 'text/html; charset=utf-8'
    });

    switch (req.method) {
      case 'GET':
        const fs = require('fs');
        const rs = fs.createReadStream('./form.html');
        rs.pipe(res);
        break;
      case 'POST':
        let rawData = '';
        req
          .on('data', chunk => {
            rawData = rawData + chunk;
          })
          .on('end', () => {
            const decoded = decodeURIComponent(rawData);
            const qs = require('querystring');
            const answer = qs.parse(decoded);
            const aName = answer['name'];
            const aSelected = answer['yaki-shabu'];
            console.info('[' + now + '] 投稿: ' + decoded);
            res.write(
              '<!DOCTYPE html><html lang="ja"><body><h1>' +
                aName+'さんは' +aSelected+
                'に投票しました</h1></body></html>'
            );
            res.end();
          });
        break;
      default:
        break;
    }
  })
  .on('error', e => {
    console.error('[' + new Date() + '] Server Error', e);
  })
  .on('clientError', e => {
    console.error('[' + new Date() + '] Client Error', e);
  });
const port = 8000;
server.listen(port, () => {
  console.info('[' + new Date() + '] Listening on ' + port);
});
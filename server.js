const http = require('http');
const fs = require('fs');
const path = require('path');

// .env 파일에서 환경변수 로드
try {
    const env = fs.readFileSync(path.join(__dirname, '.env'), 'utf8');
    env.split('\n').forEach(line => {
        const [k, ...v] = line.split('=');
        if (k && v.length) process.env[k.trim()] = v.join('=').trim();
    });
} catch {}

const MIME = {
    '.html': 'text/html',
    '.css':  'text/css',
    '.js':   'application/javascript',
};

const server = http.createServer(async (req, res) => {
    // API 라우트
    if (req.method === 'POST' && req.url === '/api/generate') {
        let body = '';
        req.on('data', d => body += d);
        req.on('end', async () => {
            try {
                // Express 호환 res 메서드 추가
                res.status = (code) => {
                    res.statusCode = code;
                    return {
                        json: (data) => {
                            res.setHeader('Content-Type', 'application/json');
                            res.end(JSON.stringify(data));
                        },
                        end: () => res.end(),
                    };
                };
                const handler = require('./api/generate');
                req.body = JSON.parse(body);
                await handler(req, res);
            } catch (err) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: err.message }));
            }
        });
        return;
    }

    // 정적 파일 서빙
    let filePath = path.join(__dirname, req.url === '/' ? 'index.html' : req.url);
    const ext = path.extname(filePath);
    if (!ext) filePath += '.html';

    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(404);
            res.end('Not found');
            return;
        }
        res.writeHead(200, { 'Content-Type': MIME[path.extname(filePath)] || 'text/plain' });
        res.end(data);
    });
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`\n✅ 서버 실행 중: http://localhost:${PORT}\n`);
    if (!process.env.GROQ_API_KEY) {
        console.log('⚠️  GROQ_API_KEY가 없습니다. .env 파일에 키를 추가하세요.\n');
    }
});

module.exports = async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) return res.status(500).json({ error: 'Server configuration error' });

    try {
        const { prompt } = req.body;

        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'llama-3.3-70b-versatile',
                messages: [
                    {
                        role: 'system',
                        content: '당신은 전문 브랜드 전략가입니다. 반드시 한국어로 답변하세요. JSON 형식으로만 응답하고 마크다운 코드 블록 없이 순수 JSON만 반환하세요.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: 0.75,
                max_tokens: 4096
            })
        });

        const data = await response.json();

        if (!response.ok) {
            return res.status(response.status).json({ error: data.error?.message || 'API error' });
        }

        const text = data.choices?.[0]?.message?.content;
        if (!text) return res.status(500).json({ error: '응답이 비어있습니다.' });

        return res.status(200).json({ text });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

module.exports.config = {
    api: { bodyParser: { sizeLimit: '10mb' } }
};

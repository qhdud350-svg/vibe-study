let results = {};
let images = [];

const TABS = [
    { id: 'positioning', label: '브랜드 포지셔닝' },
    { id: 'persona',     label: '타겟 페르소나' },
    { id: 'personality', label: '퍼스낼리티 & 톤앤매너' },
    { id: 'story',       label: '브랜드 스토리' },
    { id: 'slogan',      label: '슬로건 & 카피' },
    { id: 'design',      label: '디자인 방향성' },
    { id: 'casestudy',   label: 'Case Study' },
];

function esc(str) {
    return String(str || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

// ─── 탭별 렌더러 ────────────────────────────────────────────────

const RENDERERS = {
    positioning: (d) => `
        <div class="slide-label">Brand Positioning</div>
        <div class="slide-title">${esc(d.headline)}</div>
        <hr class="slide-rule">
        ${d.differentiators?.length ? `<div class="kw-line"><span class="kw-label">핵심 차별점 &nbsp;</span>${d.differentiators.map(esc).join(' · ')}</div>` : ''}
        ${d.description ? `<div class="pt-bullets"><div class="pt-item">${esc(d.description)}</div></div>` : ''}
        ${d.vs_competitors?.length ? `
        <div class="pt-section">
            <div class="pt-section-label">경쟁사 비교</div>
            <div class="pt-bullets">${d.vs_competitors.map(c=>`
                <div class="pt-item"><strong>${esc(c.brand)}</strong>&ensp;${esc(c.their_position)}${c.our_advantage ? `<br><span style="color:var(--accent);font-weight:500">우리 ▸ ${esc(c.our_advantage)}</span>` : ''}</div>`).join('')}
            </div>
        </div>` : ''}`,

    persona: (d) => `
        <div class="slide-label">Target Persona</div>
        <div class="persona-pt">
            <div class="persona-pt-name">${esc(d.name)}</div>
            <div class="persona-pt-meta">${esc(d.age_job)}</div>
        </div>
        <hr class="slide-rule">
        ${d.lifestyle_tags?.length ? `<div class="kw-line"><span class="kw-label">라이프스타일 &nbsp;</span>${d.lifestyle_tags.map(esc).join(' · ')}</div>` : ''}
        ${d.intro ? `<div class="pt-bullets"><div class="pt-item" style="font-style:italic">"${esc(d.intro)}"</div></div>` : ''}
        ${d.needs?.length ? `
        <div class="pt-section">
            <div class="pt-section-label">니즈</div>
            <div class="pt-bullets">${d.needs.map(x=>`<div class="pt-item">${esc(x)}</div>`).join('')}</div>
        </div>` : ''}
        ${d.painpoints?.length ? `
        <div class="pt-section">
            <div class="pt-section-label">페인포인트</div>
            <div class="pt-bullets">${d.painpoints.map(x=>`<div class="pt-item">${esc(x)}</div>`).join('')}</div>
        </div>` : ''}`,

    personality: (d) => `
        <div class="slide-label">Brand Personality</div>
        ${d.keywords?.length ? `<div class="slide-title">${d.keywords.map(esc).join(' · ')}</div>` : ''}
        <hr class="slide-rule">
        ${d.tone_description ? `<div class="kw-line"><span class="kw-label">톤 앤 매너 &nbsp;</span>${esc(d.tone_description)}</div>` : ''}
        ${d.do_expressions?.length ? `
        <div class="pt-section">
            <div class="pt-section-label">DO</div>
            <div class="pt-bullets">${d.do_expressions.map(x=>`<div class="pt-item">${esc(x)}</div>`).join('')}</div>
        </div>` : ''}
        ${d.dont_expressions?.length ? `
        <div class="pt-section">
            <div class="pt-section-label" style="color:#FF3B30">DON'T</div>
            <div class="pt-bullets">${d.dont_expressions.map(x=>`<div class="pt-item">${esc(x)}</div>`).join('')}</div>
        </div>` : ''}`,

    story: (d) => `
        <div class="slide-label">Brand Story</div>
        ${d.why ? `<div class="slide-title">${esc(d.why)}</div>` : ''}
        <hr class="slide-rule">
        ${d.core_values?.length ? `<div class="kw-line"><span class="kw-label">핵심 가치 &nbsp;</span>${d.core_values.map(esc).join(' · ')}</div>` : ''}
        ${d.key_message ? `<div class="pt-bullets"><div class="pt-item" style="font-weight:600;color:var(--text)">${esc(d.key_message)}</div></div>` : ''}
        ${d.narrative ? `
        <div class="pt-section">
            <div class="pt-section-label">브랜드 내러티브</div>
            <div class="pt-bullets"><div class="pt-item">${esc(d.narrative)}</div></div>
        </div>` : ''}`,

    slogan: (d) => `
        <div class="slide-label">Slogan & Copy</div>
        <hr class="slide-rule" style="margin-top:8px">
        <div class="slogan-pt-list">
            ${(Array.isArray(d) ? d : []).map((s,i)=>`
            <div class="slogan-pt-item">
                <div class="slogan-pt-num">0${i+1}</div>
                <div>
                    <div class="slogan-pt-text">"${esc(s.text)}"</div>
                    <div class="slogan-pt-dir">${esc(s.direction)}</div>
                </div>
            </div>`).join('')}
        </div>`,

    design: (d) => `
        <div class="slide-label">Design Direction</div>
        ${d.keywords?.length ? `<div class="slide-title">${d.keywords.map(esc).join(' · ')}</div>` : ''}
        <hr class="slide-rule">
        ${d.colors?.length ? `
        <div class="color-strip">${d.colors.map(c=>`<div class="color-strip-seg" style="background:${esc(c.hex)}"></div>`).join('')}</div>
        <div class="color-row" style="margin-bottom:28px">${d.colors.map(c=>`
            <div class="color-item">
                <div class="color-swatch" style="background:${esc(c.hex)}"></div>
                <div class="color-hex">${esc(c.hex)}</div>
                <div class="color-name">${esc(c.name)}</div>
                <div class="color-role">${esc(c.role)}</div>
            </div>`).join('')}
        </div>` : ''}
        <div class="pt-bullets">
            ${d.font_mood ? `<div class="pt-item"><strong>폰트</strong>&ensp;${esc(d.font_mood)}</div>` : ''}
            ${d.image_style ? `<div class="pt-item"><strong>이미지</strong>&ensp;${esc(d.image_style)}</div>` : ''}
        </div>`,

    casestudy: (d) => `
        ${(Array.isArray(d) ? d : []).map(c=>`
        <div class="case-pt-item">
            <div class="slide-label">Insights & Discovery</div>
            <div class="slide-title">${esc(c.brand)}</div>
            <hr class="slide-rule">
            ${c.brand_values?.length ? `<div class="kw-line"><span class="kw-label">Brand Values &nbsp;</span>${c.brand_values.map(esc).join(' · ')}</div>` :
              c.industry ? `<div class="kw-line"><span class="kw-label">Industry &nbsp;</span>${esc(c.industry)}</div>` : ''}
            <div class="pt-bullets">
                ${(c.strategy_points||[c.strategy]).filter(Boolean).map(p=>`<div class="pt-item">${esc(p)}</div>`).join('')}
                ${c.takeaway ? `<div class="pt-item" style="color:var(--accent);font-weight:500">${esc(c.takeaway)}</div>` : ''}
            </div>
        </div>`).join('')}`,
};

// ─── 탭 이벤트 ──────────────────────────────────────────────────

function handleImages(e) {
    images = [];
    document.getElementById('imagePreview').innerHTML = '';
    Array.from(e.target.files).forEach(file => {
        const reader = new FileReader();
        reader.onload = ev => {
            images.push({ data: ev.target.result.split(',')[1], mimeType: file.type });
            const img = document.createElement('img');
            img.src = ev.target.result;
            document.getElementById('imagePreview').appendChild(img);
        };
        reader.readAsDataURL(file);
    });
    document.getElementById('uploadText').textContent = `${e.target.files.length}개 이미지 선택됨`;
}

document.getElementById('inputForm').addEventListener('submit', async e => {
    e.preventDefault();

    const data = {
        brandName:      document.getElementById('brandName').value,
        industry:       document.getElementById('industry').value,
        region:         document.getElementById('region').value,
        competitors:    document.getElementById('competitors').value || '없음',
        feeling:        document.getElementById('feeling').value,
        targetAudience: document.getElementById('targetAudience').value,
        notes:          document.getElementById('notes').value || '없음',
    };

    document.getElementById('inputForm').style.display = 'none';
    document.getElementById('loading').style.display = 'block';
    document.getElementById('results').style.display = 'none';

    try {
        results = await generateStrategy(data);
        document.getElementById('loading').style.display = 'none';
        document.getElementById('results').style.display = 'block';
        buildTabs();
        switchTab('positioning', document.querySelector('.tab'));
    } catch (err) {
        document.getElementById('loading').style.display = 'none';
        document.getElementById('inputForm').style.display = 'block';
        alert('오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
        console.error(err);
    }
});

function buildTabs() {
    document.getElementById('tabs').innerHTML = TABS.map((t, i) =>
        `<button class="tab${i===0?' active':''}" onclick="switchTab('${t.id}',this)">${t.label}</button>`
    ).join('');
}

function switchTab(id, btn) {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    if (btn) btn.classList.add('active');
    const content = document.getElementById('tabContent');
    const renderer = RENDERERS[id];
    if (renderer && results[id]) {
        try { content.innerHTML = renderer(results[id]); }
        catch { content.textContent = JSON.stringify(results[id], null, 2); }
    } else {
        content.textContent = results[id] || '';
    }
}

// ─── API 호출 ────────────────────────────────────────────────────

async function generateStrategy(data) {
    const prompt = `당신은 전문 브랜드 전략가입니다. 아래 클라이언트 정보를 바탕으로 한국어로 브랜드 전략을 작성하세요.

[클라이언트 정보]
- 브랜드명: ${data.brandName}
- 업종: ${data.industry}
- 타겟 지역: ${data.region}
- 경쟁 브랜드: ${data.competitors}
- 원하는 느낌: ${data.feeling}
- 주요 타겟: ${data.targetAudience}
- 추가 메모: ${data.notes}

아래 JSON 구조를 정확히 따르세요. 마크다운 없이 순수 JSON만 반환하세요:

{
  "positioning": {
    "headline": "임팩트 있는 한 줄 포지셔닝 선언",
    "description": "시장 내 위치와 전략 설명 (2-3문장)",
    "differentiators": ["차별점1", "차별점2", "차별점3"],
    "vs_competitors": [
      {"brand": "경쟁브랜드명", "their_position": "그들의 포지션", "our_advantage": "우리의 강점"}
    ]
  },
  "persona": {
    "name": "한국 이름",
    "age_job": "나이, 직업",
    "intro": "이 사람을 한 문장으로",
    "lifestyle_tags": ["태그1", "태그2", "태그3", "태그4", "태그5"],
    "needs": ["니즈1", "니즈2", "니즈3"],
    "painpoints": ["페인포인트1", "페인포인트2", "페인포인트3"]
  },
  "personality": {
    "keywords": ["키워드1", "키워드2", "키워드3", "키워드4", "키워드5"],
    "tone_description": "언어 톤과 감성 방향 설명",
    "do_expressions": ["써야 할 표현1", "써야 할 표현2", "써야 할 표현3"],
    "dont_expressions": ["피해야 할 표현1", "피해야 할 표현2", "피해야 할 표현3"]
  },
  "story": {
    "why": "브랜드 존재 이유 (한 문장, 임팩트 있게)",
    "core_values": ["핵심가치1", "핵심가치2", "핵심가치3"],
    "key_message": "고객에게 전달할 핵심 메시지 한 문장",
    "narrative": "브랜드 스토리 서술 (3-4문장)"
  },
  "slogan": [
    {"text": "슬로건1", "direction": "방향성과 감성 설명"},
    {"text": "슬로건2", "direction": "설명"},
    {"text": "슬로건3", "direction": "설명"},
    {"text": "슬로건4", "direction": "설명"},
    {"text": "슬로건5", "direction": "설명"}
  ],
  "design": {
    "colors": [
      {"hex": "#HEX코드", "name": "컬러명", "role": "메인"},
      {"hex": "#HEX코드", "name": "컬러명", "role": "서브"},
      {"hex": "#HEX코드", "name": "컬러명", "role": "포인트"}
    ],
    "font_mood": "폰트 무드와 타이포그래피 방향",
    "image_style": "이미지와 사진 스타일 방향",
    "keywords": ["키워드1", "키워드2", "키워드3", "키워드4", "키워드5"]
  },
  "casestudy": [
    {
      "brand": "브랜드명",
      "industry": "업종/지역",
      "brand_values": ["가치키워드1", "가치키워드2", "가치키워드3", "가치키워드4", "가치키워드5"],
      "strategy_points": ["핵심 전략 포인트1 (1-2문장)", "전략 포인트2 (1-2문장)", "전략 포인트3 (1-2문장)"],
      "takeaway": "이 브랜드에서 참고할 핵심 포인트"
    },
    {
      "brand": "브랜드명2",
      "industry": "업종/지역",
      "brand_values": ["키워드1", "키워드2", "키워드3", "키워드4"],
      "strategy_points": ["전략 포인트1", "전략 포인트2", "전략 포인트3"],
      "takeaway": "참고 포인트"
    },
    {
      "brand": "브랜드명3",
      "industry": "업종/지역",
      "brand_values": ["키워드1", "키워드2", "키워드3", "키워드4"],
      "strategy_points": ["전략 포인트1", "전략 포인트2", "전략 포인트3"],
      "takeaway": "참고 포인트"
    }
  ]
}`;

    const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
    });

    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || `오류 (${res.status})`);
    }

    const json = await res.json();
    const text = json.text;
    if (!text) throw new Error('응답이 비어있습니다.');

    try {
        return JSON.parse(text);
    } catch {
        const m = text.match(/\{[\s\S]*\}/);
        if (m) return JSON.parse(m[0]);
        throw new Error('응답 형식 오류');
    }
}

// ─── 리셋 & PPT ─────────────────────────────────────────────────

function goBack() {
    document.getElementById('results').style.display = 'none';
    document.getElementById('inputForm').style.display = 'block';
}

function resetForm() {
    document.getElementById('inputForm').reset();
    document.getElementById('imagePreview').innerHTML = '';
    document.getElementById('uploadText').textContent = '이미지를 클릭하여 업로드 (선택)';
    images = [];
    results = {};
    document.getElementById('results').style.display = 'none';
    document.getElementById('inputForm').style.display = 'block';
}

function toText(id, d) {
    if (!d) return '';
    switch(id) {
        case 'positioning':
            return [d.headline,'',d.description,'','차별점',...(d.differentiators||[]).map(x=>`• ${x}`),'','경쟁사',...(d.vs_competitors||[]).map(c=>`${c.brand}: ${c.their_position}`)].join('\n');
        case 'persona':
            return [`${d.name} | ${d.age_job}`,`"${d.intro}"`,'','라이프스타일',(d.lifestyle_tags||[]).join(', '),'','니즈',...(d.needs||[]).map(x=>`• ${x}`),'','페인포인트',...(d.painpoints||[]).map(x=>`• ${x}`)].join('\n');
        case 'personality':
            return [`키워드: ${(d.keywords||[]).join(', ')}`,'',d.tone_description,'','DO',...(d.do_expressions||[]).map(x=>`✓ ${x}`),"","DON'T",...(d.dont_expressions||[]).map(x=>`✗ ${x}`)].join('\n');
        case 'story':
            return [d.why,'',`핵심 가치: ${(d.core_values||[]).join(', ')}`,'',d.key_message,'',d.narrative].join('\n');
        case 'slogan':
            return (d||[]).map((s,i)=>`${i+1}. "${s.text}"\n   → ${s.direction}`).join('\n\n');
        case 'design':
            return [`컬러: ${(d.colors||[]).map(c=>`${c.name}(${c.hex})`).join(', ')}`,'',`폰트: ${d.font_mood}`,'',`이미지: ${d.image_style}`,'',`키워드: ${(d.keywords||[]).join(', ')}`].join('\n');
        case 'casestudy':
            return (d||[]).map(c=>`${c.brand} (${c.industry})\n${c.strategy}\n💡 ${c.takeaway}`).join('\n\n');
        default: return JSON.stringify(d);
    }
}

async function downloadPPT() {
    const pptx = new PptxGenJS();
    pptx.layout = 'LAYOUT_WIDE';

    TABS.forEach(({ id, label }) => {
        const slide = pptx.addSlide();
        slide.background = { color: 'FFFFFF' };
        slide.addShape(pptx.ShapeType.rect, { x:0, y:0, w:'100%', h:0.06, fill:{ color:'1D1D1F' } });
        slide.addText('AI 브랜드 전략 파트너', { x:0.6, y:0.22, w:11, h:0.28, fontSize:8, color:'AEAEB2', fontFace:'Arial' });
        slide.addText(label, { x:0.6, y:0.6, w:11.8, h:0.7, fontSize:26, bold:true, color:'1D1D1F', fontFace:'Arial' });
        slide.addShape(pptx.ShapeType.line, { x:0.6, y:1.42, w:11.8, h:0, line:{ color:'F0F0F0', width:1 } });
        slide.addText(toText(id, results[id]), { x:0.6, y:1.6, w:11.8, h:5.2, fontSize:12, color:'6E6E73', fontFace:'Arial', valign:'top', wrap:true });
    });

    const brandName = document.getElementById('brandName').value || '브랜드전략';
    pptx.writeFile({ fileName: `${brandName}_브랜드전략.pptx` });
}

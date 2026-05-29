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
        <div class="res-hero">${esc(d.headline)}</div>
        ${d.description ? `<p class="res-desc">${esc(d.description)}</p>` : ''}
        ${d.differentiators?.length ? `
        <div class="res-block">
            <div class="res-label">핵심 차별점</div>
            <div class="tag-row">${d.differentiators.map(x=>`<span class="tag tag-blue">${esc(x)}</span>`).join('')}</div>
        </div>` : ''}
        ${d.vs_competitors?.length ? `
        <div class="res-block">
            <div class="res-label">경쟁사 비교</div>
            <div class="mini-grid">${d.vs_competitors.map(c=>`
                <div class="mini-card">
                    <div class="mini-title">${esc(c.brand)}</div>
                    <div class="mini-desc">${esc(c.their_position)}</div>
                    ${c.our_advantage ? `<div class="mini-accent">우리 ▸ ${esc(c.our_advantage)}</div>` : ''}
                </div>`).join('')}
            </div>
        </div>` : ''}`,

    persona: (d) => `
        <div class="persona-card">
            <div class="persona-avatar">${esc((d.name||'?').charAt(0))}</div>
            <div>
                <div class="persona-name">${esc(d.name)}</div>
                <div class="persona-meta">${esc(d.age_job)}</div>
                <div class="persona-intro">"${esc(d.intro)}"</div>
            </div>
        </div>
        ${d.lifestyle_tags?.length ? `
        <div class="res-block">
            <div class="res-label">라이프스타일</div>
            <div class="tag-row">${d.lifestyle_tags.map(x=>`<span class="tag tag-gray">${esc(x)}</span>`).join('')}</div>
        </div>` : ''}
        ${d.needs?.length ? `
        <div class="res-block">
            <div class="res-label">니즈</div>
            <div class="mini-grid">${d.needs.map(x=>`<div class="mini-card"><div class="mini-desc">${esc(x)}</div></div>`).join('')}</div>
        </div>` : ''}
        ${d.painpoints?.length ? `
        <div class="res-block">
            <div class="res-label">페인포인트</div>
            <div class="mini-grid">${d.painpoints.map(x=>`<div class="mini-card mini-card-red"><div class="mini-desc">${esc(x)}</div></div>`).join('')}</div>
        </div>` : ''}`,

    personality: (d) => `
        ${d.keywords?.length ? `
        <div class="res-block">
            <div class="res-label">브랜드 키워드</div>
            <div class="tag-row">${d.keywords.map(x=>`<span class="tag tag-dark">${esc(x)}</span>`).join('')}</div>
        </div>` : ''}
        ${d.tone_description ? `
        <div class="res-block">
            <div class="res-label">언어 톤 & 감성</div>
            <p class="res-desc">${esc(d.tone_description)}</p>
        </div>` : ''}
        ${(d.do_expressions?.length || d.dont_expressions?.length) ? `
        <div class="res-block">
            <div class="res-label">커뮤니케이션 가이드</div>
            <div class="do-dont">
                <div class="do-box">
                    <div class="dd-label do-label">DO</div>
                    ${(d.do_expressions||[]).map(x=>`<div class="dd-item">${esc(x)}</div>`).join('')}
                </div>
                <div class="dont-box">
                    <div class="dd-label dont-label">DON'T</div>
                    ${(d.dont_expressions||[]).map(x=>`<div class="dd-item">${esc(x)}</div>`).join('')}
                </div>
            </div>
        </div>` : ''}`,

    story: (d) => `
        ${d.why ? `<div class="story-why">${esc(d.why)}</div>` : ''}
        ${d.core_values?.length ? `
        <div class="res-block">
            <div class="res-label">핵심 가치</div>
            <div class="tag-row">${d.core_values.map(x=>`<span class="tag tag-blue">${esc(x)}</span>`).join('')}</div>
        </div>` : ''}
        ${d.key_message ? `<div class="key-msg">${esc(d.key_message)}</div>` : ''}
        ${d.narrative ? `
        <div class="res-block">
            <div class="res-label">브랜드 내러티브</div>
            <p class="res-desc">${esc(d.narrative)}</p>
        </div>` : ''}`,

    slogan: (d) => `
        <div class="slogan-list">
            ${(Array.isArray(d) ? d : []).map(s=>`
                <div class="slogan-card">
                    <div class="slogan-text">"${esc(s.text)}"</div>
                    <div class="slogan-dir">${esc(s.direction)}</div>
                </div>`).join('')}
        </div>`,

    design: (d) => `
        ${d.colors?.length ? `
        <div class="res-block">
            <div class="res-label">컬러 팔레트</div>
            <div class="color-row">
                ${d.colors.map(c=>`
                    <div class="color-item">
                        <div class="color-swatch" style="background:${esc(c.hex)}"></div>
                        <div class="color-hex">${esc(c.hex)}</div>
                        <div class="color-name">${esc(c.name)}</div>
                        <div class="color-role">${esc(c.role)}</div>
                    </div>`).join('')}
            </div>
        </div>` : ''}
        ${d.font_mood ? `
        <div class="res-block">
            <div class="res-label">폰트 & 타이포그래피</div>
            <p class="res-desc">${esc(d.font_mood)}</p>
        </div>` : ''}
        ${d.image_style ? `
        <div class="res-block">
            <div class="res-label">이미지 & 사진 스타일</div>
            <p class="res-desc">${esc(d.image_style)}</p>
        </div>` : ''}
        ${d.keywords?.length ? `
        <div class="res-block">
            <div class="res-label">디자인 키워드</div>
            <div class="tag-row">${d.keywords.map(x=>`<span class="tag tag-gray">${esc(x)}</span>`).join('')}</div>
        </div>` : ''}`,

    casestudy: (d) => `
        <div class="case-list">
            ${(Array.isArray(d) ? d : []).map(c=>`
                <div class="case-card">
                    <div class="case-head">
                        <span class="case-brand">${esc(c.brand)}</span>
                        <span class="case-industry">${esc(c.industry)}</span>
                    </div>
                    <div class="case-strategy">${esc(c.strategy)}</div>
                    <div class="case-takeaway">💡 ${esc(c.takeaway)}</div>
                </div>`).join('')}
        </div>`,
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
    {"brand": "브랜드명", "industry": "업종/지역", "strategy": "핵심 전략 요약 (2-3문장)", "takeaway": "참고할 구체적인 포인트"},
    {"brand": "브랜드명2", "industry": "업종/지역", "strategy": "전략 요약", "takeaway": "참고 포인트"},
    {"brand": "브랜드명3", "industry": "업종/지역", "strategy": "전략 요약", "takeaway": "참고 포인트"}
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

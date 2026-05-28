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
        `<button class="tab${i === 0 ? ' active' : ''}" onclick="switchTab('${t.id}', this)">${t.label}</button>`
    ).join('');
}

function switchTab(id, btn) {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    if (btn) btn.classList.add('active');
    document.getElementById('tabContent').textContent = results[id] || '';
}

async function generateStrategy(data) {
    const prompt = `당신은 전문 브랜드 전략가입니다. 다음 클라이언트 정보를 바탕으로 브랜드 전략 문서를 상세하게 한국어로 작성해주세요.

[클라이언트 정보]
- 브랜드명: ${data.brandName}
- 업종: ${data.industry}
- 타겟 지역: ${data.region}
- 경쟁 브랜드: ${data.competitors}
- 원하는 느낌/키워드: ${data.feeling}
- 주요 타겟 고객: ${data.targetAudience}
- 추가 메모: ${data.notes}
${images.length > 0 ? '\n첨부된 레퍼런스 이미지의 무드, 컬러, 스타일을 전략에 적극 반영해주세요.' : ''}

아래 7개 섹션을 각각 2~3단락 이상 상세하게 작성하여 JSON으로 반환해주세요.

{
  "positioning": "브랜드 포지셔닝 — 시장 내 위치, 경쟁사 대비 차별점, 포지셔닝 전략 (2~3단락)",
  "persona": "타겟 페르소나 — 주요 고객 프로필(이름/나이/직업), 라이프스타일, 구매 동기, 니즈와 페인포인트 (2~3단락)",
  "personality": "브랜드 퍼스낼리티 & 톤앤매너 — 브랜드 성격 키워드 5개, 언어 톤, 감성 방향, 피해야 할 표현 (2~3단락)",
  "story": "브랜드 스토리 — 브랜드 존재 이유, 핵심 가치, 고객에게 전달할 메시지 (2~3단락)",
  "slogan": "슬로건 & 카피 — 슬로건 후보 5개, 각각 카피 방향성과 감성 설명 포함",
  "design": "디자인 방향성 — 메인 컬러 팔레트(HEX 코드 포함), 서브 컬러, 폰트 무드, 이미지/사진 스타일, 전반적 디자인 키워드 (2~3단락)",
  "casestudy": "Case Study — 동일 업종 또는 유사 포지셔닝의 성공 브랜딩 사례 3개 (각각: 브랜드명, 핵심 전략 요약, 우리 브랜드가 참고할 점)"
}`;

    const parts = [{ text: prompt }];
    images.forEach(img => parts.push({ inline_data: { mime_type: img.mimeType, data: img.data } }));

    const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            contents: [{ parts }],
            generationConfig: { response_mime_type: 'application/json', temperature: 0.75 }
        })
    });

    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error?.message || `오류 (${res.status})`);
    }

    const json = await res.json();
    const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error('응답이 비어있습니다.');

    try {
        return JSON.parse(text);
    } catch {
        const m = text.match(/\{[\s\S]*\}/);
        if (m) return JSON.parse(m[0]);
        throw new Error('응답 형식 오류');
    }
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

async function downloadPPT() {
    const pptx = new PptxGenJS();
    pptx.layout = 'LAYOUT_WIDE';

    TABS.forEach(({ id, label }) => {
        const slide = pptx.addSlide();
        slide.background = { color: 'FFFFFF' };

        slide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: '100%', h: 0.06, fill: { color: '1D1D1F' } });

        slide.addText('AI 브랜드 전략 파트너', {
            x: 0.6, y: 0.22, w: 11, h: 0.28,
            fontSize: 8, color: 'AEAEB2', fontFace: 'Arial'
        });

        slide.addText(label, {
            x: 0.6, y: 0.6, w: 11.8, h: 0.7,
            fontSize: 26, bold: true, color: '1D1D1F', fontFace: 'Arial'
        });

        slide.addShape(pptx.ShapeType.line, {
            x: 0.6, y: 1.42, w: 11.8, h: 0,
            line: { color: 'F0F0F0', width: 1 }
        });

        slide.addText(results[id] || '', {
            x: 0.6, y: 1.6, w: 11.8, h: 5.2,
            fontSize: 12, color: '6E6E73', fontFace: 'Arial',
            valign: 'top', wrap: true
        });
    });

    const brandName = document.getElementById('brandName').value || '브랜드전략';
    pptx.writeFile({ fileName: `${brandName}_브랜드전략.pptx` });
}

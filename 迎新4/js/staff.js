// ====================================================
// 教职工端 App - 步骤扫码站模式 v3.0
// 每个步骤设一个扫码站，工作人员扫学生码 → 标记该步骤完成
// 页面：工作台 → 选站扫码 → 扫码结果 → 今日记录
// ====================================================

const STAFF_PAGES = [
    { id: 'workbench', title: '工作台',   icon: 'fas fa-th-large' },
    { id: 'scan',      title: '步骤扫码', icon: 'fas fa-qrcode' },
    { id: 'result',    title: '核验结果', icon: 'fas fa-user-check' },
    { id: 'records',   title: '今日记录', icon: 'fas fa-list-alt' }
];

// 6个报到步骤配置（与学生端对应）
// needScan: true = 需要老师扫码核验；false = 系统自动/学生自助
const CHECKIN_STEPS = [
    { id: 1, name: '完善信息',   icon: 'fas fa-edit',           color: '#722ED1', bg: '#F9F0FF',  desc: '学生填写个人信息后系统自动生成报到码', needScan: false },
    { id: 2, name: '在线缴费',   icon: 'fas fa-credit-card',    color: '#FA8C16', bg: '#FFF7E6',  desc: '核查缴费凭证，扫报到码确认，系统自动生成学号', needScan: true  },
    { id: 3, name: '选择宿舍',   icon: 'fas fa-bed',            color: '#13C2C2', bg: '#E6FFFB',  desc: '学生自主在线选宿舍，系统自动确认', needScan: false },
    { id: 4, name: '物品领取',   icon: 'fas fa-box-open',       color: '#52C41A', bg: '#F6FFED',  desc: '学生到物资点领取后，扫报到码完成核验', needScan: true  },
    { id: 5, name: '办理一卡通', icon: 'fas fa-id-card',        color: '#FF4D4F', bg: '#FFF1F0',  desc: '发放一卡通，扫报到码确认领卡完成', needScan: true  },
    { id: 6, name: '注册易班',   icon: 'fas fa-users',          color: '#1677FF', bg: '#E6F4FF',  desc: '学生自助完成易班注册并加入班级群', needScan: false },
];

const SS = {
    card: 'background:white;border-radius:8px;padding:14px;margin-bottom:10px;border:1px solid #E5EAF3;',
    cardTitle: 'font-size:13px;font-weight:600;color:#1F2D3D;margin-bottom:10px;display:flex;align-items:center;gap:6px;',
    input: 'width:100%;padding:8px 12px;border:1px solid #E5EAF3;border-radius:6px;font-size:13px;color:#1F2D3D;outline:none;box-sizing:border-box;',
    label: 'font-size:12px;color:#5B6B7A;margin-bottom:4px;display:block;',
    btnPrimary: (color='#1677FF') => `width:100%;padding:11px;background:${color};color:white;border:none;border-radius:6px;font-size:14px;font-weight:500;cursor:pointer;`,
    badge: (color, bg) => `display:inline-flex;align-items:center;padding:2px 8px;border-radius:4px;font-size:11px;font-weight:500;color:${color};background:${bg};`,
};

// ── 当前工作人员状态 ──
let _currentStation = null;  // 当前负责的步骤 id（1-7）
let _scanResult = null;       // 上次扫码结果

// 模拟学生数据
const MOCK_STUDENT = {
    name: '张小明', examNo: '130621202410001', idCard: '130621****0012',
    dept: '计算机学院', major: '计算机应用技术', cls: '计算机2401班',
    stuNo: '202401001', advisor: '李建国老师',
    steps: [
        { id:1, done:true,  doneAt:'08:15' },
        { id:2, done:true,  doneAt:'09:10' },
        { id:3, done:true,  doneAt:'09:28' },
        { id:4, done:true,  doneAt:'09:55' },
        { id:5, done:false, doneAt:null },
        { id:6, done:false, doneAt:null },
    ]
};

// 今日扫码记录
let _todayRecords = [
    { name:'王建国', stuNo:'202401002', cls:'计算机2401', stepId:5, time:'09:58', result:'success' },
    { name:'刘思宇', stuNo:'202401003', cls:'电商2401',   stepId:2, time:'09:45', result:'success' },
    { name:'陈晓峰', stuNo:'202401004', cls:'计算机2401', stepId:4, time:'09:33', result:'warn' },
];

// ═══════════════════════════════════════════
const staffPages = {

// ─── 页1：工作台 ───
workbench: () => `
    <!-- 工作人员头部 -->
    <div style="${SS.card}background:linear-gradient(135deg,#1677FF,#0958D9);border:none;padding:18px;">
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:14px;">
            <div style="width:40px;height:40px;background:rgba(255,255,255,0.2);border-radius:50%;display:flex;align-items:center;justify-content:center;color:white;font-size:18px;font-weight:700;">李</div>
            <div>
                <div style="font-size:14px;font-weight:600;color:white;">李老师 · 迎新工作人员</div>
                <div style="font-size:12px;color:rgba(255,255,255,0.75);">${_currentStation ? '当前步骤站：' + CHECKIN_STEPS.find(s=>s.id===_currentStation)?.name : '请选择负责的步骤站'}</div>
            </div>
            <span style="margin-left:auto;background:rgba(255,255,255,0.2);color:white;padding:3px 8px;border-radius:4px;font-size:11px;">在岗</span>
        </div>
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;">
            ${[['今日扫码', _todayRecords.length + ' 人'], ['成功标记', _todayRecords.filter(r=>r.result==='success').length + ' 人'], ['异常提醒', _todayRecords.filter(r=>r.result==='warn').length + ' 人']].map(([l,n])=>`
                <div style="text-align:center;background:rgba(255,255,255,0.15);border-radius:8px;padding:10px 6px;">
                    <div style="font-size:20px;font-weight:700;color:white;">${n}</div>
                    <div style="font-size:10px;color:rgba(255,255,255,0.75);">${l}</div>
                </div>`).join('')}
        </div>
    </div>

    <!-- 选择步骤站 -->
    <div style="${SS.card}">
        <div style="${SS.cardTitle}"><i class="fas fa-map-pin" style="color:#1677FF;"></i>选择我的步骤站</div>
        <div style="font-size:12px;color:#9AACBA;margin-bottom:10px;">选择后，扫码将自动标记该步骤完成</div>
        <div style="display:flex;flex-direction:column;gap:7px;">
            ${CHECKIN_STEPS.map(step => `
                <div onclick="selectStation(${step.id})" style="display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:7px;cursor:pointer;border:1.5px solid ${_currentStation===step.id ? step.color : '#E5EAF3'};background:${_currentStation===step.id ? step.bg : 'white'};transition:all 0.2s;">
                    <div style="width:32px;height:32px;border-radius:8px;background:${step.bg};display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                        <i class="${step.icon}" style="color:${step.color};font-size:14px;"></i>
                    </div>
                    <div style="flex:1;">
                        <div style="font-size:13px;font-weight:600;color:#1F2D3D;">Step ${step.id} · ${step.name}</div>
                        <div style="font-size:11px;color:#9AACBA;margin-top:1px;">${step.desc}</div>
                        <div style="margin-top:4px;">
                            <span style="font-size:10px;padding:1px 6px;border-radius:3px;${step.needScan?'background:#FFF7E6;border:1px solid #FFD591;color:#D48806;':'background:#F6FFED;border:1px solid #B7EB8F;color:#52C41A;'}">
                                ${step.needScan?'<i class="fas fa-qrcode" style="font-size:9px;"></i> 需扫码核验':'<i class="fas fa-magic" style="font-size:9px;"></i> 系统自动'}
                            </span>
                        </div>
                    </div>
                    ${_currentStation===step.id ? `<i class="fas fa-check-circle" style="color:${step.color};font-size:16px;"></i>` : '<i class="fas fa-chevron-right" style="color:#BCC9D4;font-size:12px;"></i>'}
                </div>
            `).join('')}
        </div>
    </div>

    ${_currentStation ? `
    <button onclick="staffNavTo('scan')" style="${SS.btnPrimary(CHECKIN_STEPS.find(s=>s.id===_currentStation)?.color)}">
        <i class="fas fa-qrcode" style="margin-right:6px;"></i>
        开始扫码 · Step ${_currentStation} ${CHECKIN_STEPS.find(s=>s.id===_currentStation)?.name}
    </button>` : `
    <div style="text-align:center;padding:14px;color:#9AACBA;font-size:13px;border:1px dashed #E5EAF3;border-radius:8px;">
        请先选择上方步骤站，再开始扫码
    </div>`}
`,

// ─── 页2：步骤扫码 ───
scan: () => {
    const step = _currentStation ? CHECKIN_STEPS.find(s=>s.id===_currentStation) : null;
    return `
    <!-- 当前步骤提示 -->
    ${step ? `
    <div style="${SS.card}background:${step.bg};border-color:${step.color}40;padding:12px 14px;">
        <div style="display:flex;align-items:center;gap:10px;">
            <div style="width:36px;height:36px;border-radius:8px;background:white;display:flex;align-items:center;justify-content:center;flex-shrink:0;box-shadow:0 2px 6px ${step.color}30;">
                <i class="${step.icon}" style="color:${step.color};font-size:16px;"></i>
            </div>
            <div>
                <div style="font-size:13px;font-weight:700;color:${step.color};">Step ${step.id} · ${step.name}</div>
                <div style="font-size:11px;color:#5B6B7A;">${step.desc}</div>
            </div>
            <button onclick="staffNavTo('workbench')" style="margin-left:auto;padding:4px 10px;background:white;border:1px solid ${step.color}50;border-radius:5px;color:${step.color};font-size:11px;cursor:pointer;">换站</button>
        </div>
    </div>` : `
    <div style="${SS.card}background:#FFF7E6;border-color:#FA8C1640;padding:12px 14px;text-align:center;color:#FA8C16;font-size:13px;">
        <i class="fas fa-exclamation-triangle" style="margin-right:6px;"></i>未选择步骤站，<span onclick="staffNavTo('workbench')" style="text-decoration:underline;cursor:pointer;">返回选择</span>
    </div>`}

    <!-- 扫码框 -->
    <div style="${SS.card}text-align:center;padding:18px 14px;">
        <div style="font-size:12px;color:#5B6B7A;margin-bottom:12px;">将学生报到凭证的二维码对准扫描框</div>
        <div style="width:200px;height:200px;border:2.5px solid ${step?.color||'#1677FF'};border-radius:14px;margin:0 auto;position:relative;overflow:hidden;background:#F8FBFF;display:flex;align-items:center;justify-content:center;">
            <div style="position:absolute;top:0;left:0;width:18px;height:18px;border-top:3px solid ${step?.color||'#1677FF'};border-left:3px solid ${step?.color||'#1677FF'};border-radius:3px 0 0 0;background:transparent;"></div>
            <div style="position:absolute;top:0;right:0;width:18px;height:18px;border-top:3px solid ${step?.color||'#1677FF'};border-right:3px solid ${step?.color||'#1677FF'};border-radius:0 3px 0 0;background:transparent;"></div>
            <div style="position:absolute;bottom:0;left:0;width:18px;height:18px;border-bottom:3px solid ${step?.color||'#1677FF'};border-left:3px solid ${step?.color||'#1677FF'};border-radius:0 0 0 3px;background:transparent;"></div>
            <div style="position:absolute;bottom:0;right:0;width:18px;height:18px;border-bottom:3px solid ${step?.color||'#1677FF'};border-right:3px solid ${step?.color||'#1677FF'};border-radius:0 0 3px 0;background:transparent;"></div>
            <div style="position:absolute;left:0;right:0;height:2px;background:linear-gradient(to right,transparent,${step?.color||'#1677FF'},transparent);animation:scanAnim 2s linear infinite;top:20%;"></div>
            <i class="fas fa-camera" style="color:#BCC9D4;font-size:36px;"></i>
        </div>
        <style>@keyframes scanAnim{0%{top:10%;}50%{top:85%;}100%{top:10%;}}</style>

        <div style="margin-top:14px;font-size:12px;color:#9AACBA;margin-bottom:8px;">— 或手动输入 —</div>
        <div style="display:flex;gap:8px;">
            <input id="staff-scan-input" style="${SS.input}flex:1;" placeholder="学号 / 考生号 / 身份证号" />
            <button onclick="doScan()" style="padding:8px 14px;background:${step?.color||'#1677FF'};color:white;border:none;border-radius:6px;font-size:13px;cursor:pointer;white-space:nowrap;">核验</button>
        </div>

        <div style="margin-top:12px;">
            <button onclick="doScan('mock')" style="width:100%;padding:10px;background:${step?.color||'#1677FF'}15;border:1px dashed ${step?.color||'#1677FF'}50;border-radius:6px;color:${step?.color||'#1677FF'};font-size:13px;cursor:pointer;">
                <i class="fas fa-play-circle" style="margin-right:6px;"></i>模拟扫码（演示）
            </button>
        </div>
    </div>

    <!-- 今日本站小计 -->
    <div style="${SS.card}padding:10px 14px;">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">
            <span style="font-size:12px;color:#5B6B7A;font-weight:500;">本站今日处理</span>
            <span onclick="staffNavTo('records')" style="font-size:11px;color:#1677FF;cursor:pointer;">查看全部 <i class="fas fa-chevron-right"></i></span>
        </div>
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;text-align:center;">
            ${[
                ['扫码总数', _todayRecords.length + '人', '#1677FF'],
                ['成功标记', _todayRecords.filter(r=>r.result==='success').length + '人', '#52C41A'],
                ['有异常', _todayRecords.filter(r=>r.result==='warn').length + '人', '#FA8C16']
            ].map(([l,v,c]) => `
                <div style="padding:8px 4px;background:${c}10;border-radius:6px;border:1px solid ${c}25;">
                    <div style="font-size:15px;font-weight:700;color:${c};">${v}</div>
                    <div style="font-size:10px;color:#9AACBA;margin-top:1px;">${l}</div>
                </div>`).join('')}
        </div>
    </div>
`;},

// ─── 页3：核验结果 ───
result: () => {
    const stu = _scanResult;
    const step = _currentStation ? CHECKIN_STEPS.find(s=>s.id===_currentStation) : null;
    if (!stu) return `
        <div style="text-align:center;padding:40px 20px;">
            <i class="fas fa-search" style="font-size:40px;color:#BCC9D4;display:block;margin-bottom:12px;"></i>
            <div style="color:#9AACBA;font-size:13px;">尚未扫码，请先扫描学生二维码</div>
            <button onclick="staffNavTo('scan')" style="margin-top:16px;padding:9px 24px;background:#1677FF;color:white;border:none;border-radius:6px;font-size:13px;cursor:pointer;">去扫码</button>
        </div>`;

    const currentStepData = stu.steps.find(s=>s.id===_currentStation);
    const alreadyDone = currentStepData?.done;
    const prevStepsDone = _currentStation > 1 ? stu.steps.filter(s=>s.id < _currentStation).every(s=>s.done) : true;

    return `
    <!-- 学生基本信息 -->
    <div style="${SS.card}border-color:${alreadyDone?'#52C41A':step?.color||'#1677FF'};">
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px;">
            <div style="width:40px;height:40px;background:${step?.bg||'#E6F4FF'};border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:16px;font-weight:700;color:${step?.color||'#1677FF'};">${stu.name[0]}</div>
            <div style="flex:1;">
                <div style="font-size:15px;font-weight:700;color:#1F2D3D;">${stu.name}</div>
                <div style="font-size:12px;color:#5B6B7A;">${stu.major} · ${stu.cls}</div>
            </div>
            <div style="text-align:right;">
                <div style="font-size:11px;color:#9AACBA;">学号</div>
                <div style="font-size:13px;font-weight:600;color:#1F2D3D;">${stu.stuNo}</div>
            </div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:7px;">
            ${[['考生号', stu.examNo],['身份证', stu.idCard],['院系', stu.dept],['辅导员', stu.advisor]].map(([k,v])=>`
                <div style="background:#F9FAFB;border-radius:5px;padding:6px 8px;border:1px solid #F0F2F5;">
                    <div style="font-size:10px;color:#9AACBA;">${k}</div>
                    <div style="font-size:11px;font-weight:500;color:#1F2D3D;margin-top:1px;">${v}</div>
                </div>`).join('')}
        </div>
    </div>

    <!-- 步骤进度总览 -->
    <div style="${SS.card}">
        <div style="${SS.cardTitle}"><i class="fas fa-tasks" style="color:#1677FF;"></i>报到步骤进度</div>
        <div style="display:flex;flex-direction:column;gap:6px;">
            ${CHECKIN_STEPS.map(s => {
                const sd = stu.steps.find(x=>x.id===s.id);
                const isCurrent = s.id === _currentStation;
                const isDone = sd?.done;
                return `
                <div style="display:flex;align-items:center;gap:8px;padding:8px 10px;border-radius:7px;border:1.5px solid ${isCurrent?(isDone?'#52C41A':s.color)+'80':'#F0F2F5'};background:${isCurrent?(isDone?'#F6FFED':s.bg):'white'};">
                    <div style="width:24px;height:24px;border-radius:50%;background:${isDone?'#52C41A':isCurrent?s.color:'#F0F2F5'};display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                        <i class="${isDone?'fas fa-check':s.icon}" style="color:${isDone||isCurrent?'white':'#BCC9D4'};font-size:10px;"></i>
                    </div>
                    <div style="flex:1;">
                        <div style="font-size:12px;font-weight:${isCurrent?'700':'500'};color:${isCurrent?s.color:isDone?'#52C41A':'#9AACBA'};">
                            Step ${s.id} · ${s.name}
                            ${isCurrent?'<span style="font-size:10px;background:'+s.color+';color:white;padding:1px 5px;border-radius:3px;margin-left:4px;">当前站</span>':''}
                        </div>
                        ${isDone?`<div style="font-size:10px;color:#9AACBA;">已完成 ${sd.doneAt}</div>`:''}
                    </div>
                    ${isDone?`<i class="fas fa-check-circle" style="color:#52C41A;font-size:14px;"></i>`:(isCurrent?`<i class="fas fa-clock" style="color:${s.color};font-size:14px;"></i>`:`<i class="fas fa-lock" style="color:#E5EAF3;font-size:12px;"></i>`)}
                </div>`;
            }).join('')}
        </div>
    </div>

    <!-- 操作区 -->
    <div style="${SS.card}">
        ${alreadyDone ? `
        <div style="text-align:center;padding:8px 0 12px;">
            <i class="fas fa-check-circle" style="font-size:32px;color:#52C41A;display:block;margin-bottom:8px;"></i>
            <div style="font-size:14px;font-weight:700;color:#52C41A;">该步骤已完成</div>
            <div style="font-size:12px;color:#9AACBA;margin-top:4px;">${stu.name} 已在 ${currentStepData?.doneAt} 完成 ${step?.name}</div>
        </div>
        <button onclick="staffNavTo('scan')" style="${SS.btnPrimary()}">扫下一位学生</button>
        ` : !prevStepsDone ? `
        <div style="text-align:center;padding:8px 0 12px;">
            <i class="fas fa-exclamation-triangle" style="font-size:28px;color:#FA8C16;display:block;margin-bottom:8px;"></i>
            <div style="font-size:13px;font-weight:700;color:#FA8C16;">前置步骤未完成</div>
            <div style="font-size:12px;color:#9AACBA;margin-top:4px;">该学生有前序步骤尚未完成，请确认情况</div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
            <button onclick="staffNavTo('scan')" style="padding:10px;background:#F0F2F5;color:#5B6B7A;border:none;border-radius:6px;font-size:13px;cursor:pointer;">返回扫码</button>
            <button onclick="confirmStep(true)" style="padding:10px;background:#FA8C16;color:white;border:none;border-radius:6px;font-size:13px;cursor:pointer;font-weight:500;">强制标记完成</button>
        </div>
        ` : `
        <div style="text-align:center;padding:4px 0 12px;">
            <div style="font-size:13px;color:#5B6B7A;margin-bottom:4px;">当前步骤</div>
            <div style="display:inline-flex;align-items:center;gap:6px;padding:6px 14px;background:${step?.bg||'#E6F4FF'};border-radius:20px;">
                <i class="${step?.icon||'fas fa-check'}" style="color:${step?.color||'#1677FF'};"></i>
                <span style="font-size:14px;font-weight:700;color:${step?.color||'#1677FF'};">Step ${step?.id} · ${step?.name}</span>
            </div>
        </div>
        <button onclick="confirmStep(false)" style="${SS.btnPrimary(step?.color||'#1677FF')}">
            <i class="fas fa-check" style="margin-right:6px;"></i>标记完成 · ${step?.name}
        </button>
        <button onclick="staffNavTo('scan')" style="width:100%;padding:9px;margin-top:8px;background:white;border:1px solid #E5EAF3;border-radius:6px;color:#5B6B7A;font-size:13px;cursor:pointer;">取消 · 重新扫码</button>
        `}
    </div>
`;},

// ─── 页4：今日记录 ───
records: () => `
    <div style="${SS.card}padding:10px 14px;">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;">
            <span style="font-size:13px;font-weight:600;color:#1F2D3D;">今日扫码记录</span>
            <span style="font-size:11px;color:#9AACBA;">共 ${_todayRecords.length} 条</span>
        </div>
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:12px;text-align:center;">
            ${[
                ['扫码总数', _todayRecords.length + '人', '#1677FF'],
                ['成功标记', _todayRecords.filter(r=>r.result==='success').length + '人', '#52C41A'],
                ['有异常',   _todayRecords.filter(r=>r.result==='warn').length + '人',    '#FA8C16']
            ].map(([l,v,c]) => `
                <div style="padding:8px;background:${c}10;border-radius:6px;border:1px solid ${c}25;">
                    <div style="font-size:16px;font-weight:700;color:${c};">${v}</div>
                    <div style="font-size:10px;color:#9AACBA;margin-top:2px;">${l}</div>
                </div>`).join('')}
        </div>
    </div>

    <div style="${SS.card}">
        <div style="${SS.cardTitle}"><i class="fas fa-history" style="color:#1677FF;"></i>扫码明细</div>
        ${_todayRecords.length === 0 ? '<div style="text-align:center;padding:20px;color:#9AACBA;font-size:13px;">暂无记录</div>' :
        _todayRecords.slice().reverse().map(r => {
            const step = CHECKIN_STEPS.find(s=>s.id===r.stepId);
            const isOk = r.result === 'success';
            return `
            <div style="display:flex;align-items:center;gap:8px;padding:9px 0;border-bottom:1px solid #F0F2F5;">
                <div style="width:32px;height:32px;background:${isOk?'#F6FFED':'#FFF7E6'};border-radius:50%;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                    <i class="${isOk?'fas fa-check':'fas fa-exclamation'}" style="color:${isOk?'#52C41A':'#FA8C16'};font-size:12px;"></i>
                </div>
                <div style="flex:1;">
                    <div style="font-size:12px;font-weight:600;color:#1F2D3D;">${r.name} <span style="color:#9AACBA;font-weight:400;">· ${r.stuNo}</span></div>
                    <div style="display:flex;align-items:center;gap:4px;margin-top:2px;">
                        <span style="font-size:10px;padding:1px 5px;border-radius:3px;background:${step?.bg||'#E6F4FF'};color:${step?.color||'#1677FF'};">Step ${r.stepId} · ${step?.name||'未知'}</span>
                        <span style="font-size:10px;color:#9AACBA;">${r.cls}</span>
                    </div>
                </div>
                <div style="text-align:right;flex-shrink:0;">
                    <div style="font-size:11px;color:#9AACBA;">${r.time}</div>
                    <span style="${SS.badge(isOk?'#52C41A':'#FA8C16', isOk?'#F6FFED':'#FFF7E6')}">${isOk?'已标记':'异常'}</span>
                </div>
            </div>`;
        }).join('')}
    </div>

    <button onclick="staffNavTo('scan')" style="${SS.btnPrimary()}margin-bottom:10px;">
        <i class="fas fa-qrcode" style="margin-right:6px;"></i>继续扫码
    </button>
`
};

// ══════════════════════════════
// 业务函数
// ══════════════════════════════

// 选择步骤站
function selectStation(stepId) {
    _currentStation = stepId;
    renderStaffPhones();
}

// 执行扫码
function doScan(type) {
    if (!_currentStation) {
        alert('请先在工作台选择负责的步骤站');
        staffNavTo('workbench');
        return;
    }
    _scanResult = JSON.parse(JSON.stringify(MOCK_STUDENT)); // 深拷贝
    staffNavTo('result');
}

// 确认标记步骤完成
function confirmStep(force) {
    if (!_scanResult || !_currentStation) return;
    const step = _scanResult.steps.find(s=>s.id===_currentStation);
    if (!step) return;

    const now = new Date();
    const timeStr = String(now.getHours()).padStart(2,'0') + ':' + String(now.getMinutes()).padStart(2,'0');
    step.done = true;
    step.doneAt = timeStr;

    // 加入今日记录
    _todayRecords.push({
        name:   _scanResult.name,
        stuNo:  _scanResult.stuNo,
        cls:    _scanResult.cls,
        stepId: _currentStation,
        time:   timeStr,
        result: force ? 'warn' : 'success'
    });

    renderStaffPhones();
}

// ══════════════════════════════
// 导航 & 渲染
// ══════════════════════════════
let currentStaffPage = 'workbench';

function staffNavTo(pageId) {
    currentStaffPage = pageId;
    renderStaffPhones();
}

function renderStaffPhones() {
    const wrapper = document.getElementById('staff-phones');
    if (!wrapper) return;
    wrapper.innerHTML = STAFF_PAGES.map(page => {
        const isActive = page.id === currentStaffPage;
        return `
        <div style="display:flex;flex-direction:column;align-items:center;">
            <div class="phone-frame" style="${isActive?'box-shadow:0 8px 32px rgba(22,119,255,0.22),0 0 0 8px #BFDBFE,0 0 0 9px #93C5FD;':''}">
                <div class="phone-header" style="background:${isActive?'#1677FF':'#0F3A68'};">
                    <div class="phone-status">
                        <span>9:41 AM</span>
                        <span><i class="fas fa-wifi"></i> <i class="fas fa-battery-full"></i></span>
                    </div>
                    <div class="phone-title">${page.title}</div>
                    <div class="phone-subtitle">迎新现场 · 步骤扫码站</div>
                </div>
                <div class="phone-body">
                    ${typeof staffPages[page.id] === 'function' ? staffPages[page.id]() : ''}
                </div>
                <div class="phone-bottom-nav">
                    ${[
                        { id:'workbench', icon:'fa-th-large',  label:'工作台' },
                        { id:'scan',      icon:'fa-qrcode',    label:'扫码' },
                        { id:'result',    icon:'fa-user-check',label:'结果' },
                        { id:'records',   icon:'fa-list-alt',  label:'记录' }
                    ].map(n => `
                        <div class="nav-item ${page.id===n.id?'active':''}" onclick="staffNavTo('${n.id}')">
                            <i class="fas ${n.icon}"></i>
                            <span>${n.label}</span>
                        </div>`).join('')}
                </div>
            </div>
            <div class="phone-label" style="${isActive?'color:#1677FF;font-weight:600;':''}">${page.title}</div>
        </div>`;
    }).join('');
}

// ====================================================
// 学生端 App - 蓝白B端配色（重构版 v3.0）
// 流程：登录 → 完善信息(生成报到码) → 缴费(3路径) → 选宿舍 → 物品领取 → 一卡通 → 注册易班
// ====================================================

const STUDENT_PAGES = [
    { id: 'login',   title: '登录激活',   icon: 'fas fa-sign-in-alt' },
    { id: 'home',    title: '报到主页',   icon: 'fas fa-home' },
    { id: 'info',    title: '完善信息',   icon: 'fas fa-edit' },
    { id: 'payment', title: '在线缴费',   icon: 'fas fa-credit-card' },
    { id: 'dorm',    title: '选择宿舍',   icon: 'fas fa-bed' },
    { id: 'goods',   title: '物品领取',   icon: 'fas fa-box-open' },
    { id: 'card',    title: '办理一卡通', icon: 'fas fa-id-card' },
    { id: 'yiban',   title: '注册易班',   icon: 'fas fa-users' }
];

// ============ 通用样式 ============
const S = {
    card: 'background:white;border-radius:8px;padding:16px;margin-bottom:12px;border:1px solid #E5EAF3;',
    cardTitle: 'font-size:13px;font-weight:600;color:#1F2D3D;margin-bottom:12px;display:flex;align-items:center;gap:6px;',
    label: 'font-size:12px;color:#5B6B7A;margin-bottom:4px;display:block;',
    input: 'width:100%;padding:8px 12px;border:1px solid #E5EAF3;border-radius:6px;font-size:13px;color:#1F2D3D;outline:none;box-sizing:border-box;',
    btnPrimary: 'width:100%;padding:11px;background:#1677FF;color:white;border:none;border-radius:6px;font-size:14px;font-weight:500;cursor:pointer;',
    btnDefault: 'padding:7px 16px;background:white;color:#1F2D3D;border:1px solid #E5EAF3;border-radius:6px;font-size:13px;cursor:pointer;',
    divider: 'border:none;border-top:1px solid #F0F2F5;margin:12px 0;',
    badge: (color, bg) => `display:inline-flex;align-items:center;padding:2px 8px;border-radius:4px;font-size:11px;font-weight:500;color:${color};background:${bg};`,
};

// ============ 页面内容渲染 ============
const studentPages = {
    // 页1：登录激活（考生号/身份证号 + 默认密码）
    login: () => `
        <div style="${S.card}padding:20px;">
            <div style="text-align:center;margin-bottom:20px;">
                <div style="width:64px;height:64px;background:#E6F4FF;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:28px;margin:0 auto 12px;">🎓</div>
                <div style="font-size:17px;font-weight:600;color:#1F2D3D;">保定职业技术学院</div>
                <div style="font-size:14px;color:#5B6B7A;margin-top:4px;">2024级新生迎新系统</div>
            </div>
            <div style="background:#E6F4FF;border:1px solid #91CAFF;border-radius:6px;padding:10px 12px;margin-bottom:16px;">
                <div style="font-size:12px;color:#1677FF;display:flex;align-items:center;gap:6px;">
                    <i class="fas fa-info-circle"></i> 首次登录请使用录取通知书上的考生号或身份证号
                </div>
            </div>
            <div style="margin-bottom:12px;">
                <label style="${S.label}">考生号 / 身份证号 <span style="color:#FF4D4F;">*</span></label>
                <input style="${S.input}" placeholder="请输入考生号或身份证号" value="130621202410001" />
            </div>
            <div style="margin-bottom:12px;">
                <label style="${S.label}">登录密码 <span style="color:#FF4D4F;">*</span></label>
                <input type="password" style="${S.input}" placeholder="默认密码：身份证后6位" value="******" />
                <div style="font-size:11px;color:#9AACBA;margin-top:4px;">首次登录密码为身份证号后6位，登录后可修改</div>
            </div>
            <button style="${S.btnPrimary}" onclick="studentNavTo('home')">登录系统 →</button>
            <div style="text-align:center;margin-top:12px;font-size:12px;color:#9AACBA;">
                登录遇到问题？<span style="color:#1677FF;cursor:pointer;">联系招生办 0312-3091234</span>
            </div>
        </div>
    `,

    // 页2：报到主页（录取信息 + 进度摘要，步骤通过独立悬浮窗展开）
    home: () => `
        <div style="${S.card}">
            <div style="display:flex;align-items:center;gap:12px;margin-bottom:14px;">
                <div style="width:44px;height:44px;background:#1677FF;border-radius:50%;display:flex;align-items:center;justify-content:center;color:white;font-size:18px;font-weight:700;">张</div>
                <div style="flex:1;">
                    <div style="font-size:15px;font-weight:600;color:#1F2D3D;">张小明</div>
                    <div style="font-size:12px;color:#5B6B7A;">考生号：130621202410001</div>
                </div>
                <div onclick="studentNavTo('credential')" style="cursor:pointer;">
                    <div style="text-align:center;">
                        <svg width="38" height="38" viewBox="0 0 38 38"><rect x="2" y="2" width="34" height="34" rx="4" fill="#E6F4FF" stroke="#1677FF" stroke-width="1.5"/><rect x="7" y="7" width="10" height="10" rx="1.5" fill="#1677FF"/><rect x="21" y="7" width="10" height="10" rx="1.5" fill="#1677FF"/><rect x="7" y="21" width="10" height="10" rx="1.5" fill="#1677FF"/><rect x="9" y="9" width="6" height="6" rx="1" fill="white"/><rect x="23" y="9" width="6" height="6" rx="1" fill="white"/><rect x="9" y="23" width="6" height="6" rx="1" fill="white"/><rect x="23" y="21" width="4" height="4" rx="0.5" fill="#1677FF"/><rect x="29" y="25" width="4" height="6" rx="0.5" fill="#1677FF"/><rect x="23" y="27" width="4" height="4" rx="0.5" fill="#1677FF"/></svg>
                        <div style="font-size:10px;color:#1677FF;margin-top:2px;">报到凭证</div>
                    </div>
                </div>
            </div>
            <!-- 进度条 -->
            <div style="background:#F0F9FF;border-radius:6px;padding:10px 12px;margin-bottom:14px;">
                <div style="font-size:12px;color:#5B6B7A;margin-bottom:6px;">报到总进度</div>
                <div style="display:flex;align-items:center;gap:8px;">
                    <div style="flex:1;height:6px;background:#E5EAF3;border-radius:3px;overflow:hidden;">
                        <div style="width:17%;height:100%;background:linear-gradient(90deg,#1677FF,#4096FF);border-radius:3px;"></div>
                    </div>
                    <span style="font-size:13px;font-weight:600;color:#1677FF;">1/6</span>
                </div>
                <div style="display:flex;justify-content:space-between;margin-top:8px;">
                    <span style="font-size:11px;color:#52C41A;"><i class="fas fa-check-circle"></i> 已完成 1 步</span>
                    <span style="font-size:11px;color:#FA8C16;">待完成 5 步</span>
                </div>
            </div>
            <!-- 查看步骤详情按钮 -->
            <button onclick="openStepsPanel()" style="width:100%;padding:10px;background:#1677FF;color:white;border:none;border-radius:6px;font-size:13px;font-weight:500;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:6px;">
                <i class="fas fa-list-ol"></i> 查看全部报到步骤 &nbsp;<span style="background:rgba(255,255,255,0.25);padding:1px 8px;border-radius:10px;font-size:12px;">当前：Step 2 缴费</span>
            </button>
        </div>

        <div style="${S.card}">
            <div style="${S.cardTitle}"><i class="fas fa-file-alt" style="color:#1677FF;"></i>录取信息</div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
                ${[
                    ['录取院校','保定职业技术学院'],['录取专业','计算机应用技术'],
                    ['录取批次','2024年单招批次'],['班级','开学一周前同步'],
                    ['辅导员','李老师'],['学号','缴费确认后自动生成']
                ].map(([k,v]) => `
                    <div style="background:#F9FAFB;border-radius:6px;padding:8px 10px;border:1px solid #F0F2F5;">
                        <div style="font-size:11px;color:#9AACBA;margin-bottom:2px;">${k}</div>
                        <div style="font-size:12px;font-weight:500;color:${k==='学号'?'#9AACBA':'#1F2D3D'};">${v}</div>
                    </div>
                `).join('')}
            </div>
        </div>

        <!-- 当前步骤快捷卡片 -->
        <div style="${S.card}border-left:3px solid #FA8C16;cursor:pointer;" onclick="openStepsPanel()">
            <div style="display:flex;align-items:center;gap:12px;">
                <div style="width:36px;height:36px;border-radius:50%;background:#FFF7E6;display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0;">💳</div>
                <div style="flex:1;">
                    <div style="font-size:13px;font-weight:600;color:#FA8C16;">当前进行中：Step 2 · 缴费</div>
                    <div style="font-size:12px;color:#5B6B7A;margin-top:2px;">请完成缴费，或申请助学贷款/绿色通道</div>
                </div>
                <div style="text-align:right;">
                    <div style="font-size:11px;color:#FA8C16;font-weight:600;"><i class="fas fa-users"></i> 排队 18 人</div>
                    <div style="font-size:10px;color:#9AACBA;margin-top:2px;">约等待 9 分钟</div>
                </div>
            </div>
        </div>

        <!-- 步骤详情全屏弹窗 -->
        <div id="steps-panel" style="display:none;position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,0.45);backdrop-filter:blur(2px);">
            <div style="position:absolute;bottom:0;left:0;right:0;background:white;border-radius:16px 16px 0 0;max-height:92vh;overflow-y:auto;box-shadow:0 -8px 32px rgba(0,0,0,0.18);">
                <!-- 弹窗头部 -->
                <div style="position:sticky;top:0;background:white;z-index:10;padding:16px 16px 0;border-radius:16px 16px 0 0;">
                    <div style="width:40px;height:4px;background:#E5EAF3;border-radius:2px;margin:0 auto 14px;"></div>
                    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;">
                        <div>
                            <div style="font-size:16px;font-weight:700;color:#1F2D3D;">报到步骤进度</div>
                            <div style="font-size:12px;color:#5B6B7A;margin-top:2px;">共 6 步 · 已完成 1 步</div>
                        </div>
                        <button onclick="closeStepsPanel()" style="width:32px;height:32px;border-radius:50%;background:#F5F7FA;border:none;color:#5B6B7A;font-size:14px;cursor:pointer;display:flex;align-items:center;justify-content:center;">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <!-- 进度条 -->
                    <div style="height:4px;background:#F0F2F5;border-radius:2px;margin-bottom:16px;overflow:hidden;">
                        <div style="width:42%;height:100%;background:linear-gradient(90deg,#1677FF,#4096FF);border-radius:2px;"></div>
                    </div>
                </div>

                <!-- 步骤列表 -->
                <div style="padding:0 16px 32px;">
                    ${[
                        { step:1, icon:'fas fa-edit',        title:'完善信息', desc:'个人信息填写完成，报到二维码已生成', status:'done',   page:'info',    queue:0,  time:'2024-08-12 10:28', tag:null },
                        { step:2, icon:'fas fa-credit-card', title:'缴费',     desc:'请完成缴费，或申请助学贷款/绿色通道', status:'active', page:'payment', queue:18, time:null, tag:'老师扫码确认' },
                        { step:3, icon:'fas fa-bed',         title:'选择宿舍', desc:'缴费确认后，自主在线选择宿舍床位',   status:'pending',page:'dorm',    queue:0,  time:null, tag:'系统自动' },
                        { step:4, icon:'fas fa-box-open',    title:'物品领取', desc:'前往指定物资点领取录取材料与物品',   status:'pending',page:'goods',   queue:0,  time:null, tag:'系统自动' },
                        { step:5, icon:'fas fa-id-card',     title:'办理一卡通',desc:'现场办理校园一卡通，老师扫码确认', status:'pending',page:'card',    queue:42, time:null, tag:'老师扫码确认' },
                        { step:6, icon:'fas fa-users',       title:'注册易班', desc:'跳转易班完成注册并加入班级群',       status:'pending',page:'yiban',   queue:0,  time:null, tag:'自助完成' },
                    ].map((s, i, arr) => `
                        <div style="display:flex;gap:0;margin-bottom:0;">
                            <!-- 左侧线条 + 圆点 -->
                            <div style="display:flex;flex-direction:column;align-items:center;width:44px;flex-shrink:0;">
                                <div style="width:36px;height:36px;border-radius:50%;border:2px solid ${s.status==='done'?'#52C41A':s.status==='active'?'#1677FF':'#E5EAF3'};background:${s.status==='done'?'#F6FFED':s.status==='active'?'#E6F4FF':'white'};display:flex;align-items:center;justify-content:center;z-index:1;flex-shrink:0;">
                                    ${s.status==='done'
                                        ? '<i class="fas fa-check" style="color:#52C41A;font-size:13px;"></i>'
                                        : s.status==='active'
                                            ? `<i class="${s.icon}" style="color:#1677FF;font-size:13px;"></i>`
                                            : `<span style="font-size:12px;font-weight:600;color:#BCC9D4;">${s.step}</span>`
                                    }
                                </div>
                                ${i < arr.length - 1 ? `<div style="width:2px;flex:1;min-height:24px;background:${s.status==='done'?'#52C41A':'#E5EAF3'};margin:4px 0;"></div>` : ''}
                            </div>
                            <!-- 右侧内容 -->
                            <div style="flex:1;padding-left:10px;padding-bottom:${i < arr.length - 1 ? '8' : '0'}px;">
                                <div onclick="${s.status!=='pending'?`closeStepsPanel();studentNavTo('${s.page}')`:''}" 
                                     style="background:${s.status==='active'?'#F0F9FF':s.status==='done'?'white':'#FAFBFF'};border:1px solid ${s.status==='active'?'#91CAFF':'#E5EAF3'};border-radius:10px;padding:12px 14px;cursor:${s.status!=='pending'?'pointer':'default'};">
                                    <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:8px;">
                                        <div style="flex:1;">
                                            <div style="font-size:13px;font-weight:${s.status==='pending'?'400':'600'};color:${s.status==='pending'?'#9AACBA':'#1F2D3D'};display:flex;align-items:center;flex-wrap:wrap;gap:4px;">
                                                Step ${s.step} · ${s.title}
                                                ${s.status==='active'?'<span style="font-size:10px;background:#1677FF;color:white;padding:1px 6px;border-radius:3px;">进行中</span>':''}
                                                ${s.tag&&s.status!=='done'?'<span style="font-size:10px;padding:1px 5px;border-radius:3px;background:'+(s.tag==='老师扫码确认'?'#FFF7E6':'s.tag===\"系统自动\"?\"#F6FFED\":\"#F0F9FF')+';color:'+(s.tag==='老师扫码确认'?'#FA8C16':'s.tag===\"系统自动\"?\"#52C41A\":\"#1677FF')+';">'+s.tag+'</span>':''}
                                            </div>
                                            <div style="font-size:12px;color:${s.status==='active'?'#1677FF':s.status==='pending'?'#BCC9D4':'#5B6B7A'};margin-top:4px;">${s.desc}</div>
                                        </div>
                                        <div style="text-align:right;flex-shrink:0;">
                                            ${s.status==='done'
                                                ? `<div style="font-size:10px;color:#52C41A;"><i class="fas fa-check-circle"></i> 已完成</div><div style="font-size:10px;color:#9AACBA;margin-top:2px;">${s.time}</div>`
                                                : s.queue > 0
                                                    ? `<div style="font-size:11px;color:#FA8C16;font-weight:600;"><i class="fas fa-users"></i> ${s.queue} 人排队</div><div style="font-size:10px;color:#9AACBA;margin-top:2px;">约 ${Math.ceil(s.queue*0.5)} 分钟</div>`
                                                    : `<i class="fas fa-lock" style="color:#D0D7DE;font-size:14px;"></i>`
                                            }
                                        </div>
                                    </div>
                                    ${s.status==='active' ? `
                                    <div style="margin-top:10px;padding-top:10px;border-top:1px solid #D6EAF8;">
                                        <button onclick="closeStepsPanel();studentNavTo('${s.page}')" style="width:100%;padding:8px;background:#1677FF;color:white;border:none;border-radius:6px;font-size:13px;cursor:pointer;font-weight:500;">
                                            <i class="fas fa-arrow-right"></i> 立即前往
                                        </button>
                                    </div>` : ''}
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `,

    // 页3：完善信息（个人信息、家庭信息、紧急联系人）
    info: () => `
        <div style="${S.card}">
            <div style="${S.cardTitle}"><i class="fas fa-edit" style="color:#1677FF;"></i>完善个人信息 <span style="font-size:11px;color:#FF4D4F;font-weight:400;">* 必填</span></div>
            ${[
                ['手机号码','13812345678','请输入本人常用手机号'],
                ['QQ号码','987654321','请输入QQ号'],
                ['电子邮箱','zhang@qq.com','请输入邮箱地址'],
                ['微信号','zhang_xiaoming','请输入微信号']
            ].map(([l,v,p]) => `
                <div style="margin-bottom:10px;">
                    <label style="${S.label}">${l}</label>
                    <input style="${S.input}" value="${v}" placeholder="${p}" />
                </div>
            `).join('')}
        </div>
        <div style="${S.card}">
            <div style="${S.cardTitle}"><i class="fas fa-home" style="color:#1677FF;"></i>家庭信息</div>
            <div style="margin-bottom:10px;">
                <label style="${S.label}">家庭住址 <span style="color:#FF4D4F;">*</span></label>
                <input style="${S.input}" value="河北省保定市莲池区五四路88号" />
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:10px;">
                <div>
                    <label style="${S.label}">父亲姓名</label>
                    <input style="${S.input}" value="张大明" />
                </div>
                <div>
                    <label style="${S.label}">父亲电话</label>
                    <input style="${S.input}" value="13901234567" />
                </div>
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
                <div>
                    <label style="${S.label}">母亲姓名</label>
                    <input style="${S.input}" value="李小花" />
                </div>
                <div>
                    <label style="${S.label}">母亲电话</label>
                    <input style="${S.input}" value="13701234567" />
                </div>
            </div>
        </div>
        <div style="${S.card}">
            <div style="${S.cardTitle}"><i class="fas fa-phone-alt" style="color:#1677FF;"></i>紧急联系人 <span style="font-size:11px;color:#FF4D4F;font-weight:400;">* 必填</span></div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:10px;">
                <div>
                    <label style="${S.label}">联系人姓名</label>
                    <input style="${S.input}" value="张大明" />
                </div>
                <div>
                    <label style="${S.label}">与本人关系</label>
                    <select style="${S.input}">
                        <option>父亲</option>
                        <option>母亲</option>
                        <option>其他</option>
                    </select>
                </div>
            </div>
            <div>
                <label style="${S.label}">联系人电话</label>
                <input style="${S.input}" value="13901234567" />
            </div>
        </div>
        <div style="${S.card}background:#FFFBE6;border-color:#FFE58F;">
            <div style="font-size:12px;color:#D48806;display:flex;align-items:center;gap:6px;">
                <i class="fas fa-exclamation-circle"></i> 紧急联系人信息用于遇到紧急情况时学校能第一时间与家长取得联系
            </div>
        </div>
        <!-- 接站服务（选填） -->
        <div style="${S.card}background:#F0F9FF;border-color:#91CAFF;">
            <div style="${S.cardTitle}"><i class="fas fa-bus" style="color:#1677FF;"></i>接站服务（选填）</div>
            <div style="font-size:12px;color:#5B6B7A;margin-bottom:10px;">如需学校安排接站，请填写到达信息</div>
            <div style="display:flex;gap:8px;margin-bottom:8px;">
                <div style="flex:1;">
                    <label style="${S.label}">到达车站</label>
                    <select style="${S.input}">
                        <option>不需要接站</option>
                        <option>保定站（普铁）</option>
                        <option>保定东站（高铁）</option>
                        <option>保定汽车站</option>
                    </select>
                </div>
                <div style="flex:1;">
                    <label style="${S.label}">预计到达时间</label>
                    <input style="${S.input}" placeholder="如：9月1日 10:00" />
                </div>
            </div>
        </div>
        <div style="${S.card}background:#F6FFED;border-color:#B7EB8F;padding:10px 14px;">
            <div style="font-size:12px;color:#52C41A;display:flex;align-items:center;gap:6px;">
                <i class="fas fa-check-circle"></i>
                提交后系统将<strong>自动生成您的专属报到二维码</strong>，后续各步骤均凭此码办理，全程唯一
            </div>
        </div>
        <button style="${S.btnPrimary}" onclick="studentNavTo('payment')">提交信息，获取报到二维码 →</button>
    `,

    // 页4：在线缴费（显示费用明细，跳转张家口银行）
    payment: () => `
        <div style="${S.card}">
            <div style="${S.cardTitle}"><i class="fas fa-list-ul" style="color:#1677FF;"></i>费用明细</div>
            <table style="width:100%;border-collapse:collapse;font-size:13px;">
                <tr style="background:#F9FAFB;"><th style="padding:8px 10px;text-align:left;color:#5B6B7A;font-weight:500;border-bottom:1px solid #E5EAF3;">费用项目</th><th style="padding:8px 10px;text-align:right;color:#5B6B7A;font-weight:500;border-bottom:1px solid #E5EAF3;">金额（元）</th></tr>
                ${[
                    ['学费（2024-2025学年）','5,000'],
                    ['住宿费（2024-2025学年）','1,200'],
                    ['教材资料费','300'],
                    ['军训费','150']
                ].map(([n,a]) => `
                    <tr style="border-bottom:1px solid #F0F2F5;">
                        <td style="padding:9px 10px;color:#1F2D3D;">${n}</td>
                        <td style="padding:9px 10px;text-align:right;color:#1F2D3D;font-weight:500;">${a}</td>
                    </tr>
                `).join('')}
                <tr style="background:#F9FAFB;">
                    <td style="padding:10px;font-weight:600;color:#1F2D3D;">合计</td>
                    <td style="padding:10px;text-align:right;font-weight:700;color:#1677FF;font-size:16px;">6,650 元</td>
                </tr>
            </table>
        </div>

        <div style="${S.card}background:#E6F4FF;border-color:#91CAFF;">
            <div style="font-size:13px;font-weight:600;color:#1677FF;margin-bottom:8px;"><i class="fas fa-university"></i> 张家口银行在线缴费</div>
            <div style="font-size:12px;color:#5B6B7A;line-height:1.7;margin-bottom:12px;">
                • 点击下方按钮将跳转到张家口银行在线缴费平台<br>
                • 支持银行卡、微信、支付宝等多种支付方式<br>
                • 缴费成功后系统将自动同步缴费状态，请耐心等待1-5分钟
            </div>
            <button style="${S.btnPrimary}background:#52C41A;border-color:#52C41A;" onclick="alert('跳转到张家口银行缴费平台...')">
                <i class="fas fa-external-link-alt"></i> 前往张家口银行缴费平台
            </button>
        </div>

        <div style="${S.card}">
            <div style="${S.cardTitle}"><i class="fas fa-info-circle" style="color:#1677FF;"></i>缴费状态查询</div>
            <div style="background:#FFF7E6;border:1px solid #FFD591;border-radius:6px;padding:12px;display:flex;align-items:center;gap:10px;">
                <span style="font-size:20px;">⏳</span>
                <div>
                    <div style="font-size:13px;font-weight:600;color:#FA8C16;">等待缴费</div>
                    <div style="font-size:12px;color:#5B6B7A;margin-top:2px;">缴费后约1-5分钟同步到系统</div>
                </div>
            </div>
            <button style="width:100%;margin-top:10px;padding:8px;background:white;color:#1677FF;border:1px solid #1677FF;border-radius:6px;font-size:13px;cursor:pointer;" onclick="alert('刷新缴费状态...')">
                <i class="fas fa-sync"></i> 刷新缴费状态
            </button>
        </div>

        <div style="${S.card}background:#FFF1F0;border-color:#FFCCC7;">
            <div style="font-size:13px;font-weight:600;color:#FF4D4F;margin-bottom:6px;"><i class="fas fa-hand-holding-heart"></i> 经济困难学生资助</div>
            <div style="font-size:12px;color:#5B6B7A;margin-bottom:10px;">
                如有经济困难暂时无法缴费，可申请助学贷款或"绿色通道"先入学后缴费。
            </div>
            <div style="display:flex;gap:8px;">
                <button style="${S.btnDefault}flex:1;" onclick="alert('打开助学贷款申请表单')">申请助学贷款</button>
                <button style="${S.btnDefault}flex:1;" onclick="alert('打开绿色通道申请表单')">申请绿色通道</button>
            </div>
        </div>

        <div id="payment-success" style="display:none;">
            <div style="${S.card}background:#F6FFED;border-color:#B7EB8F;">
                <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px;">
                    <span style="font-size:24px;">✅</span>
                    <div>
                        <div style="font-size:14px;font-weight:600;color:#389E0D;">缴费成功</div>
                        <div style="font-size:12px;color:#52C41A;margin-top:2px;">缴费时间：2024-08-15 14:23:45</div>
                    </div>
                </div>
                <button style="${S.btnPrimary}background:#52C41A;border-color:#52C41A;" onclick="studentNavTo('credential')">
                    继续生成报到凭证 →
                </button>
            </div>
        </div>
    `,

    // 页5：选择宿舍（宿舍楼层房间可视化选择）
    dorm: () => `
        <div style="${S.card}">
            <div style="${S.cardTitle}"><i class="fas fa-bed" style="color:#1677FF;"></i>选择宿舍</div>
            <div style="background:#E6F4FF;border:1px solid #91CAFF;border-radius:6px;padding:10px 12px;margin-bottom:14px;font-size:12px;color:#1677FF;">
                <i class="fas fa-info-circle"></i> 请选择您的宿舍楼、楼层、房间和床位，系统已为您预分配到计算机学院宿舍区
            </div>
            
            <!-- 已选信息 -->
            <div style="background:#F0F9FF;border-radius:6px;padding:12px;margin-bottom:14px;">
                <div style="font-size:12px;color:#5B6B7A;margin-bottom:8px;">当前选择</div>
                <div style="font-size:14px;font-weight:600;color:#1F2D3D;">
                    <span id="selected-info">未选择</span>
                </div>
            </div>
        </div>

        <!-- 宿舍楼选择 -->
        <div style="${S.card}">
            <div style="${S.cardTitle}"><i class="fas fa-building" style="color:#1677FF;"></i>第一步：选择宿舍楼</div>
            <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:10px;">
                ${[
                    { name: '1号楼（男生）', rooms: 180, available: 23, gender: 'male' },
                    { name: '2号楼（男生）', rooms: 180, available: 15, gender: 'male' },
                    { name: '3号楼（女生）', rooms: 180, available: 8, gender: 'female' },
                    { name: '4号楼（女生）', rooms: 180, available: 12, gender: 'female' }
                ].map(building => `
                    <div onclick="selectBuilding('${building.name}')" style="${S.card}cursor:pointer;padding:12px;margin-bottom:0;border:2px solid ${building.available>0?'#E5EAF3':'#FFD591'};transition:all 0.2s;" onmouseover="this.style.borderColor='#1677FF'" onmouseout="this.style.borderColor='${building.available>0?'#E5EAF3':'#FFD591'}'">
                        <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
                            <i class="fas ${building.gender==='male'?'fa-mars':'fa-venus'}" style="color:${building.gender==='male'?'#1677FF':'#FF4D4F'};font-size:16px;"></i>
                            <span style="font-size:13px;font-weight:600;color:#1F2D3D;">${building.name}</span>
                        </div>
                        <div style="display:flex;justify-content:space-between;font-size:11px;color:#5B6B7A;">
                            <span>房间数：${building.rooms}</span>
                            <span style="color:${building.available>10?'#52C41A':building.available>0?'#FA8C16':'#FF4D4F'};">
                                剩余：${building.available}间
                            </span>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>

        <!-- 楼层选择 -->
        <div id="floor-selector" style="${S.card}display:none;">
            <div style="${S.cardTitle}"><i class="fas fa-layer-group" style="color:#1677FF;"></i>第二步：选择楼层</div>
            <div style="display:grid;grid-template-columns:repeat(6,1fr);gap:8px;">
                ${[1,2,3,4,5,6].map(floor => `
                    <div onclick="selectFloor(${floor})" style="${S.card}cursor:pointer;padding:12px;margin-bottom:0;text-align:center;border:2px solid #E5EAF3;transition:all 0.2s;" onmouseover="this.style.borderColor='#1677FF'" onmouseout="this.style.borderColor='#E5EAF3'">
                        <div style="font-size:16px;font-weight:600;color:#1F2D3D;margin-bottom:4px;">${floor}F</div>
                        <div style="font-size:10px;color:#52C41A;">可选</div>
                    </div>
                `).join('')}
            </div>
        </div>

        <!-- 房间选择 -->
        <div id="room-selector" style="${S.card}display:none;">
            <div style="${S.cardTitle}"><i class="fas fa-door-open" style="color:#1677FF;"></i>第三步：选择房间</div>
            <div style="display:grid;grid-template-columns:repeat(5,1fr);gap:8px;">
                ${Array.from({length:15}, (_, i) => {
                    const roomNo = String(i+1).padStart(2, '0');
                    const available = Math.random() > 0.3;
                    const beds = Math.floor(Math.random() * 4) + 1;
                    return `
                        <div onclick="${available?`selectRoom('${roomNo}', ${beds})`:'void(0)'}" style="${S.card}cursor:${available?'pointer':'not-allowed'};padding:10px;margin-bottom:0;text-align:center;border:2px solid ${available?'#E5EAF3':'#FFD591'};background:${available?'white':'#FFF7E6'};opacity:${available?'1':'0.6'};transition:all 0.2s;" ${available?`onmouseover="this.style.borderColor='#1677FF'" onmouseout="this.style.borderColor='#E5EAF3'"`:''}>
                            <div style="font-size:14px;font-weight:600;color:#1F2D3D;margin-bottom:4px;">${roomNo}室</div>
                            <div style="font-size:10px;color:${available?'#52C41A':'#FA8C16'};">
                                ${available?`${beds}床可选`:'已满'}
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        </div>

        <!-- 床位选择 -->
        <div id="bed-selector" style="${S.card}display:none;">
            <div style="${S.cardTitle}"><i class="fas fa-bed" style="color:#1677FF;"></i>第四步：选择床位</div>
            <div style="text-align:center;padding:20px;">
                <div style="display:inline-block;border:2px solid #E5EAF3;border-radius:8px;padding:20px;background:#F9FAFB;">
                    <!-- 房间布局示意图 -->
                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px;">
                        ${[1,2,3,4].map(bed => `
                            <div onclick="selectBed(${bed})" style="width:80px;height:60px;border:2px solid ${bed<=2?'#52C41A':'#E5EAF3'};border-radius:6px;background:${bed<=2?'#F6FFED':'white'};display:flex;flex-direction:column;align-items:center;justify-content:center;cursor:${bed<=2?'pointer':'not-allowed'};opacity:${bed<=2?'1':'0.4'};transition:all 0.2s;" ${bed<=2?`onmouseover="this.style.borderColor='#1677FF';this.style.background='#E6F4FF'" onmouseout="this.style.borderColor='#52C41A';this.style.background='#F6FFED'"`:''}>
                                <i class="fas fa-bed" style="font-size:20px;color:${bed<=2?'#52C41A':'#9AACBA'};margin-bottom:4px;"></i>
                                <div style="font-size:11px;color:${bed<=2?'#52C41A':'#9AACBA'};">
                                    ${bed}号床<br>${bed<=2?'可选':'已占'}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                    <div style="font-size:11px;color:#9AACBA;">
                        <i class="fas fa-door-closed"></i> 房门
                    </div>
                </div>
            </div>
        </div>

        <div style="${S.card}">
            <button id="confirm-dorm-btn" style="${S.btnPrimary}display:none;" onclick="confirmDormSelection()">
                <i class="fas fa-check"></i> 确认选择并继续
            </button>
        </div>

        <script>
            let selectedBuilding = '';
            let selectedFloor = '';
            let selectedRoom = '';
            let selectedBed = '';

            function selectBuilding(name) {
                selectedBuilding = name;
                document.getElementById('floor-selector').style.display = 'block';
                document.getElementById('selected-info').innerText = name;
                showSuccess('已选择：' + name);
            }

            function selectFloor(floor) {
                selectedFloor = floor + '楼';
                document.getElementById('room-selector').style.display = 'block';
                document.getElementById('selected-info').innerText = selectedBuilding + ' ' + selectedFloor;
                showSuccess('已选择：' + selectedFloor);
            }

            function selectRoom(room, beds) {
                selectedRoom = room + '室';
                document.getElementById('bed-selector').style.display = 'block';
                document.getElementById('selected-info').innerText = selectedBuilding + ' ' + selectedFloor + ' ' + selectedRoom;
                showSuccess('已选择：' + selectedRoom + '（剩余' + beds + '个床位）');
            }

            function selectBed(bed) {
                selectedBed = bed + '号床';
                const fullSelection = selectedBuilding + ' ' + selectedFloor + ' ' + selectedRoom + ' ' + selectedBed;
                document.getElementById('selected-info').innerText = fullSelection;
                document.getElementById('confirm-dorm-btn').style.display = 'block';
                showSuccess('已选择：' + selectedBed);
            }

            function confirmDormSelection() {
                const fullSelection = document.getElementById('selected-info').innerText;
                if (confirm('确认选择宿舍：\\n' + fullSelection + '？\\n\\n确认后无法更改，请仔细核对。')) {
                    showSuccess('宿舍选择成功！');
                    setTimeout(() => studentNavTo('credential'), 800);
                }
            }

            function showSuccess(msg) {
                const toast = document.createElement('div');
                toast.style.cssText = 'position:fixed;top:80px;left:50%;transform:translateX(-50%);background:#52C41A;color:white;padding:10px 20px;border-radius:6px;font-size:13px;z-index:10000;box-shadow:0 4px 16px rgba(82,196,26,0.3);';
                toast.innerHTML = '<i class="fas fa-check-circle"></i> ' + msg;
                document.body.appendChild(toast);
                setTimeout(() => toast.remove(), 2000);
            }
        </script>
    `,

    // ── 复用：报到二维码 SVG 组件 ──
    _qrSvg: (color='#1677FF', label='报到二维码 · 全程唯一') => `
        <div style="text-align:center;padding:16px 0 8px;">
            <svg width="148" height="148" viewBox="0 0 160 160" style="display:block;margin:0 auto 10px;filter:drop-shadow(0 4px 12px ${color}30);">
                <rect width="160" height="160" rx="12" fill="white" stroke="${color}" stroke-width="2.5"/>
                <rect x="16" y="16" width="44" height="44" rx="5" fill="${color}"/>
                <rect x="100" y="16" width="44" height="44" rx="5" fill="${color}"/>
                <rect x="16" y="100" width="44" height="44" rx="5" fill="${color}"/>
                <rect x="22" y="22" width="32" height="32" rx="3" fill="white"/>
                <rect x="106" y="22" width="32" height="32" rx="3" fill="white"/>
                <rect x="22" y="106" width="32" height="32" rx="3" fill="white"/>
                <rect x="28" y="28" width="20" height="20" rx="2" fill="${color}"/>
                <rect x="112" y="28" width="20" height="20" rx="2" fill="${color}"/>
                <rect x="28" y="112" width="20" height="20" rx="2" fill="${color}"/>
                <rect x="68" y="16" width="8" height="8" fill="${color}"/><rect x="80" y="16" width="8" height="8" fill="${color}"/>
                <rect x="68" y="28" width="8" height="8" fill="${color}"/><rect x="76" y="36" width="8" height="8" fill="${color}"/>
                <rect x="68" y="44" width="8" height="8" fill="${color}"/><rect x="84" y="52" width="8" height="8" fill="${color}"/>
                <rect x="68" y="68" width="8" height="8" fill="${color}"/><rect x="80" y="68" width="8" height="8" fill="${color}"/>
                <rect x="68" y="80" width="8" height="8" fill="${color}"/><rect x="80" y="80" width="8" height="8" fill="${color}"/>
                <rect x="68" y="92" width="8" height="8" fill="${color}"/><rect x="76" y="100" width="8" height="8" fill="${color}"/>
                <rect x="68" y="108" width="8" height="8" fill="${color}"/><rect x="84" y="116" width="8" height="8" fill="${color}"/>
                <rect x="68" y="124" width="8" height="8" fill="${color}"/><rect x="80" y="132" width="8" height="8" fill="${color}"/>
                <rect x="100" y="68" width="8" height="8" fill="${color}"/><rect x="116" y="68" width="8" height="8" fill="${color}"/>
                <rect x="108" y="76" width="8" height="8" fill="${color}"/><rect x="132" y="76" width="8" height="8" fill="${color}"/>
                <rect x="100" y="84" width="8" height="8" fill="${color}"/><rect x="124" y="84" width="8" height="8" fill="${color}"/>
                <rect x="100" y="100" width="8" height="8" fill="${color}"/><rect x="116" y="108" width="8" height="8" fill="${color}"/>
                <rect x="132" y="100" width="8" height="8" fill="${color}"/><rect x="108" y="116" width="8" height="8" fill="${color}"/>
                <rect x="124" y="124" width="8" height="8" fill="${color}"/><rect x="140" y="132" width="8" height="8" fill="${color}"/>
                <rect x="16" y="68" width="8" height="8" fill="${color}"/><rect x="28" y="68" width="8" height="8" fill="${color}"/>
                <rect x="44" y="68" width="8" height="8" fill="${color}"/><rect x="16" y="80" width="8" height="8" fill="${color}"/>
                <rect x="36" y="80" width="8" height="8" fill="${color}"/><rect x="52" y="84" width="8" height="8" fill="${color}"/>
                <rect x="16" y="92" width="8" height="8" fill="${color}"/><rect x="28" y="92" width="8" height="8" fill="${color}"/>
                <text x="80" y="156" text-anchor="middle" font-size="8.5" fill="#9AACBA">130621202410001 · BDVTC2024</text>
            </svg>
            <div style="font-size:12px;font-weight:600;color:${color};">${label}</div>
            <div style="font-size:11px;color:#9AACBA;margin-top:3px;">张小明 · 考生号 130621202410001</div>
        </div>`,

    // 页6：物品领取
    goods: () => `
        <!-- 顶部二维码展示 -->
        <div style="${S.card}border-top:3px solid #FA8C16;padding:14px;">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;">
                <i class="fas fa-qrcode" style="color:#FA8C16;"></i>
                <span style="font-size:13px;font-weight:600;color:#1F2D3D;">展示报到二维码</span>
                <span style="font-size:10px;padding:1px 6px;background:#FFF7E6;color:#FA8C16;border:1px solid #FFD591;border-radius:3px;margin-left:auto;">扫码领取</span>
            </div>
            <div style="font-size:11px;color:#9AACBA;margin-bottom:10px;">到达物资点后向工作人员展示，由老师扫码完成核验</div>
            ${studentPages._qrSvg('#FA8C16','物品领取凭证码')}
            <div style="background:#FFF7E6;border-radius:6px;padding:8px 10px;margin-top:10px;font-size:11px;color:#D46B08;">
                <i class="fas fa-info-circle"></i> 此码与报到二维码相同，工作人员扫码后系统自动标记本步骤完成
            </div>
        </div>

        <!-- 领取点信息 -->
        <div style="${S.card}">
            <div style="${S.cardTitle}"><i class="fas fa-map-marker-alt" style="color:#FA8C16;"></i>物品领取点</div>
            <div style="display:flex;flex-direction:column;gap:8px;">
                ${[
                    { name:'录取通知书存档回执', loc:'A楼大厅 · 1号窗口', time:'08:30-17:00', items:'录取通知书回执', icon:'fas fa-file-alt', color:'#1677FF', floor:'一楼' },
                    { name:'军训物品发放', loc:'体育馆入口 · 2号台', time:'08:30-17:30', items:'军训服、帽子、腰带', icon:'fas fa-tshirt', color:'#52C41A', floor:'一楼' },
                    { name:'教材领取', loc:'图书馆一楼 · 教材室', time:'09:00-16:30', items:'第一学期教材（按专业）', icon:'fas fa-book', color:'#722ED1', floor:'一楼' },
                    { name:'新生资料包', loc:'各院系报到台', time:'08:00-18:00', items:'校园手册、课表、院系介绍', icon:'fas fa-folder-open', color:'#FA8C16', floor:'' },
                ].map(item => `
                    <div style="border:1px solid #F0F2F5;border-radius:8px;padding:10px 12px;background:#FAFBFF;">
                        <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;">
                            <div style="width:32px;height:32px;border-radius:7px;background:${item.color}15;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                                <i class="${item.icon}" style="color:${item.color};font-size:14px;"></i>
                            </div>
                            <div style="flex:1;">
                                <div style="font-size:13px;font-weight:600;color:#1F2D3D;">${item.name}</div>
                                <div style="font-size:11px;color:#9AACBA;margin-top:1px;">${item.items}</div>
                            </div>
                        </div>
                        <div style="display:flex;gap:12px;font-size:11px;">
                            <span style="color:#1677FF;"><i class="fas fa-map-pin"></i> ${item.loc}</span>
                            <span style="color:#52C41A;"><i class="fas fa-clock"></i> ${item.time}</span>
                        </div>
                    </div>`).join('')}
            </div>
        </div>

        <!-- 外链：物品商城 -->
        <div style="${S.card}background:#F0F9FF;border-color:#91CAFF;">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;">
                <i class="fas fa-shopping-cart" style="color:#1677FF;"></i>
                <span style="font-size:13px;font-weight:600;color:#1677FF;">校园物品商城</span>
            </div>
            <div style="font-size:12px;color:#5B6B7A;margin-bottom:10px;">生活用品、学习用品可提前线上下单，报到当天指定点取货</div>
            <button style="width:100%;padding:9px;background:white;color:#1677FF;border:1.5px solid #1677FF;border-radius:6px;font-size:13px;cursor:pointer;" onclick="alert('跳转校园物品商城…')">
                <i class="fas fa-external-link-alt"></i> 前往校园物品商城
            </button>
        </div>
    `,

    // 页7：办理一卡通
    card: () => `
        <!-- 二维码展示区 -->
        <div style="${S.card}border-top:3px solid #FF4D4F;padding:14px;">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;">
                <i class="fas fa-qrcode" style="color:#FF4D4F;"></i>
                <span style="font-size:13px;font-weight:600;color:#1F2D3D;">展示报到二维码</span>
                <span style="font-size:10px;padding:1px 6px;background:#FFF1F0;color:#FF4D4F;border:1px solid #FFCCC7;border-radius:3px;margin-left:auto;">老师扫码确认</span>
            </div>
            <div style="font-size:11px;color:#9AACBA;margin-bottom:10px;">到达一卡通服务窗口后，由工作人员扫码核验，完成后系统自动标记本步骤</div>
            ${studentPages._qrSvg('#FF4D4F','一卡通办理凭证码')}
        </div>

        <!-- 办理点信息 -->
        <div style="${S.card}">
            <div style="${S.cardTitle}"><i class="fas fa-map-marker-alt" style="color:#FF4D4F;"></i>办理点信息</div>
            <div style="border:1.5px solid #FFCCC7;border-radius:8px;padding:12px 14px;background:#FFF8F8;">
                <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;">
                    <div style="width:36px;height:36px;background:#FFF1F0;border-radius:8px;display:flex;align-items:center;justify-content:center;">
                        <i class="fas fa-id-card" style="color:#FF4D4F;font-size:16px;"></i>
                    </div>
                    <div>
                        <div style="font-size:14px;font-weight:700;color:#1F2D3D;">一卡通服务中心</div>
                        <div style="font-size:12px;color:#FF4D4F;margin-top:1px;">F101 · 综合服务楼一楼</div>
                    </div>
                </div>
                <div style="display:flex;flex-direction:column;gap:6px;font-size:12px;">
                    <div style="display:flex;gap:8px;align-items:flex-start;">
                        <i class="fas fa-clock" style="color:#FA8C16;margin-top:1px;width:14px;flex-shrink:0;"></i>
                        <span style="color:#5B6B7A;">工作时间：08:30 - 17:30（报到当日延长至 19:00）</span>
                    </div>
                    <div style="display:flex;gap:8px;align-items:flex-start;">
                        <i class="fas fa-phone" style="color:#1677FF;margin-top:1px;width:14px;flex-shrink:0;"></i>
                        <span style="color:#5B6B7A;">咨询电话：0312-309-1200</span>
                    </div>
                    <div style="display:flex;gap:8px;align-items:flex-start;">
                        <i class="fas fa-users" style="color:#52C41A;margin-top:1px;width:14px;flex-shrink:0;"></i>
                        <span style="color:#5B6B7A;">当前排队：<strong style="color:#FA8C16;">42 人</strong>，预计等待 <strong style="color:#FA8C16;">21 分钟</strong></span>
                    </div>
                </div>
            </div>
        </div>

        <!-- 携带材料 & 办理说明 -->
        <div style="${S.card}">
            <div style="${S.cardTitle}"><i class="fas fa-list-ol" style="color:#1677FF;"></i>办理须知</div>
            <div style="display:flex;flex-direction:column;gap:7px;">
                ${[
                    ['1', '携带材料', '报到二维码（手机展示）+ 身份证原件', '#1677FF'],
                    ['2', '办理流程', '出示报到码 → 老师扫码确认 → 采集照片 → 领卡', '#52C41A'],
                    ['3', '初始密码', '办卡时设置，首次使用须修改', '#FA8C16'],
                    ['4', '充值方式', '现场充值 / 微信扫码在线充值', '#722ED1'],
                ].map(([n,k,v,c]) => `
                    <div style="display:flex;gap:10px;padding:8px 10px;border:1px solid #F0F2F5;border-radius:6px;">
                        <div style="width:20px;height:20px;background:${c}15;border-radius:50%;display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:11px;font-weight:700;color:${c};">${n}</div>
                        <div>
                            <div style="font-size:11px;color:#9AACBA;">${k}</div>
                            <div style="font-size:12px;color:#1F2D3D;margin-top:1px;">${v}</div>
                        </div>
                    </div>`).join('')}
            </div>
        </div>
    `,

    // 页8：注册易班（最终步骤）
    yiban: () => `
        <!-- 完成庆祝 -->
        <div style="${S.card}background:linear-gradient(135deg,#1677FF,#0958D9);border:none;text-align:center;padding:22px 16px;">
            <div style="font-size:34px;margin-bottom:6px;">🎉</div>
            <div style="font-size:17px;font-weight:700;color:white;letter-spacing:1px;">即将完成全部报到！</div>
            <div style="font-size:12px;color:rgba(255,255,255,0.8);margin-top:6px;">最后一步：注册易班并加入班级群</div>
        </div>

        <!-- 易班介绍 -->
        <div style="${S.card}">
            <div style="${S.cardTitle}"><i class="fas fa-users" style="color:#1677FF;"></i>什么是易班</div>
            <div style="background:#E6F4FF;border:1px solid #91CAFF;border-radius:6px;padding:10px 12px;margin-bottom:12px;">
                <div style="font-size:12px;color:#1677FF;line-height:1.7;">
                    易班是教育部全国高校互动社区平台，学校通知、课程资源、活动报名、班级管理均通过易班操作，<strong>全校必须注册</strong>
                </div>
            </div>
            <div style="display:flex;flex-direction:column;gap:7px;margin-bottom:14px;">
                ${[
                    ['fas fa-user-plus','注册账号','使用学号注册，手机号绑定验证','#1677FF'],
                    ['fas fa-users','加入班级群','搜索班级或使用邀请码加入','#52C41A'],
                    ['fas fa-bell','开启通知','允许推送，不错过学校重要通知','#FA8C16'],
                ].map(([ic,k,v,c]) => `
                    <div style="display:flex;gap:10px;padding:8px 10px;border:1px solid #F0F2F5;border-radius:6px;">
                        <div style="width:28px;height:28px;background:${c}15;border-radius:50%;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                            <i class="${ic}" style="color:${c};font-size:12px;"></i>
                        </div>
                        <div>
                            <div style="font-size:12px;font-weight:600;color:#1F2D3D;">${k}</div>
                            <div style="font-size:11px;color:#9AACBA;margin-top:1px;">${v}</div>
                        </div>
                    </div>`).join('')}
            </div>

            <!-- 班级信息 -->
            <div style="background:#F9F0FF;border:1px solid #D3ADF7;border-radius:6px;padding:10px 12px;margin-bottom:12px;">
                <div style="font-size:11px;color:#722ED1;font-weight:600;margin-bottom:6px;"><i class="fas fa-check-circle"></i> 班级已同步（开学一周前更新）</div>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;font-size:12px;">
                    <div><span style="color:#9AACBA;">班级：</span><strong>计算机2401班</strong></div>
                    <div><span style="color:#9AACBA;">辅导员：</span><strong>李老师</strong></div>
                    <div><span style="color:#9AACBA;">邀请码：</span><strong style="color:#722ED1;">BD2401-CS</strong></div>
                    <div><span style="color:#9AACBA;">群号：</span><strong>123456789</strong></div>
                </div>
            </div>

            <!-- 跳转按钮 -->
            <button style="${S.btnPrimary}" onclick="window.open('https://www.yiban.cn','_blank');void(0)">
                <i class="fas fa-external-link-alt"></i> 前往易班官网注册
            </button>
            <button style="width:100%;padding:9px;margin-top:8px;background:white;color:#1677FF;border:1px solid #1677FF;border-radius:6px;font-size:13px;cursor:pointer;" onclick="alert('跳转易班App下载页…')">
                <i class="fas fa-mobile-alt"></i> 下载易班 App
            </button>
        </div>

        <!-- 全部完成 -->
        <div style="${S.card}background:#F6FFED;border-color:#B7EB8F;">
            <div style="text-align:center;padding:8px 0;">
                <i class="fas fa-graduation-cap" style="font-size:28px;color:#52C41A;display:block;margin-bottom:8px;"></i>
                <div style="font-size:15px;font-weight:700;color:#389E0D;">恭喜完成全部报到步骤！</div>
                <div style="font-size:12px;color:#5B6B7A;margin-top:6px;line-height:1.9;">欢迎加入保定职业技术学院大家庭 🎓<br>祝您大学生活愉快，学业有成！</div>
            </div>
        </div>
    `,

    // 页：报到凭证（独立查看）
    credential: () => `
        <div style="${S.card}text-align:center;padding:20px 16px;">
            <div style="font-size:12px;color:#5B6B7A;margin-bottom:3px;">保定职业技术学院</div>
            <div style="font-size:17px;font-weight:700;color:#1F2D3D;margin-bottom:14px;">2024级新生报到凭证</div>
            ${studentPages._qrSvg('#1677FF','报到二维码 · 全程唯一')}
            <div style="display:flex;justify-content:center;gap:6px;flex-wrap:wrap;margin-top:6px;">
                <span style="${S.badge('#52C41A','#F6FFED')}">已完善信息</span>
                <span style="${S.badge('#FA8C16','#FFF7E6')}">缴费待确认</span>
            </div>
        </div>

        <div style="${S.card}">
            <div style="${S.cardTitle}"><i class="fas fa-clipboard-list" style="color:#1677FF;"></i>步骤完成情况</div>
            ${[
                ['完善信息','2024-08-12 10:28','done'],
                ['缴费（老师扫码确认）','等待现场确认','active'],
                ['选择宿舍','系统自动','pending'],
                ['物品领取','扫码核验','pending'],
                ['办理一卡通','老师扫码确认','pending'],
                ['注册易班','自助完成','pending'],
            ].map(([t,d,s]) => `
                <div style="display:flex;align-items:center;gap:10px;padding:7px 0;border-bottom:1px solid #F0F2F5;">
                    <i class="fas ${s==='done'?'fa-check-circle':s==='active'?'fa-clock':'fa-circle'}" style="color:${s==='done'?'#52C41A':s==='active'?'#FA8C16':'#BCC9D4'};"></i>
                    <span style="font-size:12px;flex:1;color:${s==='pending'?'#9AACBA':'#1F2D3D'};">${t}</span>
                    <span style="font-size:11px;color:#9AACBA;">${d}</span>
                </div>`).join('')}
        </div>

        <div style="${S.card}background:#E6F4FF;border-color:#91CAFF;text-align:center;padding:12px;">
            <div style="font-size:13px;color:#1677FF;font-weight:600;margin-bottom:3px;">📱 请截图保存此二维码</div>
            <div style="font-size:12px;color:#5B6B7A;">各步骤工作人员均凭此码扫码核验，全程有效</div>
        </div>
    `
};

// ============ 导航函数 ============
let currentStudentPage = 'login';

function studentNavTo(pageId) {
    currentStudentPage = pageId;
    renderStudentPhones();
    // 滚动到活动手机
    const wrapper = document.getElementById('student-phones');
    if (wrapper) {
        const idx = STUDENT_PAGES.findIndex(p => p.id === pageId);
        if (idx >= 0) {
            const cards = wrapper.querySelectorAll('.phone-frame');
            if (cards[idx]) {
                cards[idx].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
            }
        }
    }
}

// ============ 步骤弹窗控制函数 ============
function openStepsPanel() {
    const panel = document.getElementById('steps-panel');
    if (panel) {
        panel.style.display = 'block';
        document.body.style.overflow = 'hidden';
        // 启动排队人数动态刷新
        startQueueRefresh();
    }
}

function closeStepsPanel() {
    const panel = document.getElementById('steps-panel');
    if (panel) {
        panel.style.display = 'none';
        document.body.style.overflow = '';
        stopQueueRefresh();
    }
}

// 模拟排队人数实时刷新
let queueRefreshTimer = null;
function startQueueRefresh() {
    stopQueueRefresh();
    queueRefreshTimer = setInterval(() => {
        // 随机波动模拟排队变化
        const queueEls = document.querySelectorAll('[data-queue]');
        queueEls.forEach(el => {
            const base = parseInt(el.getAttribute('data-queue'));
            const delta = Math.floor(Math.random() * 5) - 2;
            const newVal = Math.max(0, base + delta);
            el.setAttribute('data-queue', newVal);
            el.textContent = newVal + ' 人排队';
        });
    }, 3000);
}
function stopQueueRefresh() {
    if (queueRefreshTimer) { clearInterval(queueRefreshTimer); queueRefreshTimer = null; }
}

// 点击遮罩关闭
document.addEventListener('click', function(e) {
    const panel = document.getElementById('steps-panel');
    if (panel && e.target === panel) closeStepsPanel();
});

// ============ 渲染手机列表 ============
function renderStudentPhones() {
    const wrapper = document.getElementById('student-phones');
    if (!wrapper) return;
    wrapper.innerHTML = STUDENT_PAGES.map(page => {
        const isActive = page.id === currentStudentPage;
        return `
            <div style="display:flex;flex-direction:column;align-items:center;">
                <div class="phone-frame" style="${isActive ? 'box-shadow:0 8px 32px rgba(22,119,255,0.22),0 0 0 8px #BFDBFE,0 0 0 9px #93C5FD;' : ''}">
                    <div class="phone-header" style="background:${isActive ? '#1677FF' : '#0958D9'};">
                        <div class="phone-status">
                            <span>9:41 AM</span>
                            <span><i class="fas fa-wifi"></i> <i class="fas fa-battery-full"></i></span>
                        </div>
                        <div class="phone-title">${page.title}</div>
                        <div class="phone-subtitle">保定职业技术学院迎新系统</div>
                    </div>
                    <div class="phone-body">
                        ${studentPages[page.id] ? studentPages[page.id]() : ''}
                    </div>
                    <div class="phone-bottom-nav">
                        ${[
                            { id:'home', icon:'fa-home', label:'首页' },
                            { id:'info', icon:'fa-clipboard', label:'信息' },
                            { id:'payment', icon:'fa-credit-card', label:'缴费' },
                            { id:'credential', icon:'fa-qrcode', label:'凭证' }
                        ].map(n => `
                            <div class="nav-item ${page.id === n.id ? 'active' : ''}" onclick="studentNavTo('${n.id}')">
                                <i class="fas ${n.icon}"></i>
                                <span>${n.label}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
                <div class="phone-label" style="${isActive ? 'color:#1677FF;font-weight:600;' : ''}">${page.title}</div>
            </div>
        `;
    }).join('');
}

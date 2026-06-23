// ====================================================
// PC 管理后台 - 蓝白B端配色（重构版 v2.0）
// 新增：新生档案管理、基础配置中心、分班管理、缴费监控
// 删除：宿舍相关模块（宿舍由独立系统管理）
// ====================================================

const ADMIN_PAGES = [
    { id: 'dashboard', title: '报到总览', icon: 'fas fa-chart-pie' },
    { id: 'students', title: '新生档案管理', icon: 'fas fa-user-graduate' },
    { id: 'config', title: '基础配置中心', icon: 'fas fa-cog' },
    { id: 'class', title: '分班管理', icon: 'fas fa-users' },
    { id: 'studentno', title: '学号管理', icon: 'fas fa-id-badge' },
    { id: 'card', title: '一卡通管理', icon: 'fas fa-id-card' },
    { id: 'payment', title: '缴费监控', icon: 'fas fa-credit-card' },
    { id: 'unregistered', title: '未报到追踪', icon: 'fas fa-search' }
];

// ============ PC后台通用布局 ============
function adminLayout(pageId, content) {
    return `
        <div style="display:flex;min-height:600px;">
            <!-- 侧边导航 -->
            <div style="width:200px;min-width:200px;background:#001529;flex-shrink:0;">
                <div style="padding:16px;border-bottom:1px solid rgba(255,255,255,0.08);">
                    <div style="font-size:13px;color:rgba(255,255,255,0.85);font-weight:600;">迎新管理系统</div>
                    <div style="font-size:11px;color:rgba(255,255,255,0.4);margin-top:2px;">保定职业技术学院</div>
                </div>
                <div style="padding:8px 0;">
                    ${ADMIN_PAGES.map(p => `
                        <div onclick="switchAdminPage('${p.id}')"
                             style="padding:10px 20px;font-size:13px;cursor:pointer;display:flex;align-items:center;gap:10px;
                             ${p.id === pageId
                                ? 'color:white;background:#1677FF;'
                                : 'color:rgba(255,255,255,0.65);'
                             }transition:all 0.2s;">
                            <i class="${p.icon}" style="font-size:14px;width:16px;text-align:center;"></i>
                            ${p.title}
                        </div>
                    `).join('')}
                </div>
                <div style="margin-top:auto;padding:16px;border-top:1px solid rgba(255,255,255,0.08);position:absolute;bottom:0;width:200px;">
                    <div style="display:flex;align-items:center;gap:8px;">
                        <div style="width:28px;height:28px;background:#1677FF;border-radius:50%;display:flex;align-items:center;justify-content:center;color:white;font-size:12px;font-weight:600;">管</div>
                        <div>
                            <div style="font-size:12px;color:rgba(255,255,255,0.85);">王管理员</div>
                            <div style="font-size:11px;color:rgba(255,255,255,0.4);">超级管理员</div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- 主内容区 -->
            <div style="flex:1;background:#F5F7FA;overflow-y:auto;">
                ${content}
            </div>
        </div>
    `;
}

// ============ 各页面内容 ============
const AS = {
    card: 'background:white;border-radius:8px;padding:20px;margin-bottom:16px;border:1px solid #E5EAF3;box-shadow:0 1px 3px rgba(0,0,0,0.04);',
    cardTitle: 'font-size:14px;font-weight:600;color:#1F2D3D;margin-bottom:16px;display:flex;align-items:center;gap:8px;',
    badge: (c, bg) => `display:inline-flex;align-items:center;padding:2px 8px;border-radius:4px;font-size:11px;font-weight:500;color:${c};background:${bg};`,
    input: 'padding:7px 12px;border:1px solid #E5EAF3;border-radius:6px;font-size:13px;outline:none;color:#1F2D3D;',
    btnPrimary: 'padding:7px 16px;background:#1677FF;color:white;border:none;border-radius:6px;font-size:13px;cursor:pointer;',
    btnDefault: 'padding:7px 16px;background:white;color:#1F2D3D;border:1px solid #E5EAF3;border-radius:6px;font-size:13px;cursor:pointer;',
};

function adminPageHeader(title, subtitle, extra = '') {
    return `
        <div style="background:white;padding:16px 24px;border-bottom:1px solid #E5EAF3;display:flex;align-items:center;justify-content:space-between;">
            <div>
                <div style="font-size:16px;font-weight:600;color:#1F2D3D;">${title}</div>
                <div style="font-size:12px;color:#5B6B7A;margin-top:2px;">${subtitle}</div>
            </div>
            <div style="display:flex;gap:8px;">${extra}</div>
        </div>
    `;
}

const adminPages = {
    // 页1：报到总览大屏
    dashboard: () => adminLayout('dashboard', `
        ${adminPageHeader('报到总览', '2024届新生报到实时数据 · 最后更新：09:45:32',
            `<button style="${AS.btnDefault}"><i class="fas fa-sync"></i> 刷新</button>
             <button style="${AS.btnPrimary}"><i class="fas fa-download"></i> 导出报表</button>`
        )}
        <div style="padding:20px;">
            <!-- 数据卡片行 -->
            <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:20px;">
                ${[
                    { label:'总人数', value:'2,450', sub:'2024届全部新生', color:'#1677FF', bg:'#E6F4FF', icon:'fas fa-users' },
                    { label:'已报到', value:'1,968', sub:'报到率 80.3%', color:'#52C41A', bg:'#F6FFED', icon:'fas fa-user-check' },
                    { label:'未报到', value:'482', sub:'较昨日 -127', color:'#FF4D4F', bg:'#FFF1F0', icon:'fas fa-user-times' },
                    { label:'已缴费', value:'2,203', sub:'缴费率 89.9%', color:'#FA8C16', bg:'#FFF7E6', icon:'fas fa-credit-card' }
                ].map(item => `
                    <div style="${AS.card}margin-bottom:0;display:flex;align-items:center;gap:14px;">
                        <div style="width:44px;height:44px;background:${item.bg};border-radius:10px;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                            <i class="${item.icon}" style="color:${item.color};font-size:18px;"></i>
                        </div>
                        <div>
                            <div style="font-size:22px;font-weight:700;color:${item.color};">${item.value}</div>
                            <div style="font-size:12px;color:#1F2D3D;font-weight:500;">${item.label}</div>
                            <div style="font-size:11px;color:#9AACBA;margin-top:2px;">${item.sub}</div>
                        </div>
                    </div>
                `).join('')}
            </div>

            <!-- 图表区 -->
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:20px;">
                <div style="${AS.card}margin-bottom:0;">
                    <div style="${AS.cardTitle}"><i class="fas fa-chart-pie" style="color:#1677FF;"></i>各学院报到率</div>
                    <div style="display:flex;flex-direction:column;gap:10px;">
                        ${[
                            ['计算机学院', 88, '#1677FF', '440/500'],
                            ['护理学院', 82, '#52C41A', '369/450'],
                            ['电商学院', 76, '#FA8C16', '342/450'],
                            ['机电学院', 71, '#722ED1', '284/400'],
                            ['建筑学院', 65, '#EB2F96', '130/200']
                        ].map(([name, pct, color, count]) => `
                            <div>
                                <div style="display:flex;justify-content:space-between;margin-bottom:4px;">
                                    <span style="font-size:12px;color:#1F2D3D;">${name}</span>
                                    <span style="font-size:12px;color:#5B6B7A;">${count} <strong style="color:${color};">${pct}%</strong></span>
                                </div>
                                <div style="height:6px;background:#F0F2F5;border-radius:3px;overflow:hidden;">
                                    <div style="width:${pct}%;height:100%;background:${color};border-radius:3px;transition:width 0.3s;"></div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                <div style="${AS.card}margin-bottom:0;">
                    <div style="${AS.cardTitle}"><i class="fas fa-chart-bar" style="color:#1677FF;"></i>今日报到趋势（按小时）</div>
                    <div style="display:flex;align-items:flex-end;gap:6px;height:140px;padding:0 4px;">
                        ${[45,82,156,203,178,142,110,87,64,45,32,18].map((v, i) => {
                            const h = Math.round(v / 220 * 130);
                            const hour = 7 + i;
                            return `
                                <div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:4px;">
                                    <div style="width:100%;height:${h}px;background:${i===3?'#1677FF':'#BAD7FF'};border-radius:3px 3px 0 0;"></div>
                                    <div style="font-size:10px;color:#9AACBA;">${hour}</div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                    <div style="text-align:center;font-size:11px;color:#9AACBA;margin-top:6px;">时段（07:00 - 18:00）</div>
                </div>
            </div>

            <!-- 实时动态 -->
            <div style="${AS.card}margin-bottom:0;">
                <div style="${AS.cardTitle}"><i class="fas fa-broadcast-tower" style="color:#52C41A;"></i>实时报到动态 <span style="width:8px;height:8px;background:#52C41A;border-radius:50%;display:inline-block;animation:pulse 1.5s infinite;"></span></div>
                <style>@keyframes pulse{0%,100%{opacity:1;}50%{opacity:0.4;}}</style>
                <table style="width:100%;border-collapse:collapse;font-size:13px;">
                    <tr style="background:#F9FAFB;">
                        ${['时间','学号','姓名','班级','步骤','状态'].map(h => `<th style="padding:8px 12px;text-align:left;color:#5B6B7A;font-weight:500;border-bottom:1px solid #E5EAF3;">${h}</th>`).join('')}
                    </tr>
                    ${[
                        ['09:45:12','202401001','张小明','计算机2401','现场报到','完成'],
                        ['09:44:58','202401002','王建国','计算机2401','在线缴费','完成'],
                        ['09:44:31','202401003','刘思宇','电商2401','完善信息','进行中'],
                        ['09:43:22','202401004','陈晓峰','机电2401','账号登录','完成'],
                        ['09:42:45','202401005','赵美丽','护理2401','生成凭证','完成']
                    ].map(([time,id,name,cls,step,status]) => `
                        <tr style="border-bottom:1px solid #F0F2F5;">
                            <td style="padding:9px 12px;color:#5B6B7A;font-size:12px;">${time}</td>
                            <td style="padding:9px 12px;color:#5B6B7A;">${id}</td>
                            <td style="padding:9px 12px;font-weight:500;">${name}</td>
                            <td style="padding:9px 12px;color:#5B6B7A;">${cls}</td>
                            <td style="padding:9px 12px;">${step}</td>
                            <td style="padding:9px 12px;"><span style="${AS.badge(status==='完成'?'#52C41A':'#FA8C16', status==='完成'?'#F6FFED':'#FFF7E6')}">${status}</span></td>
                        </tr>
                    `).join('')}
                </table>
            </div>
        </div>
    `),

    // 页2：新生档案管理（左侧树形结构 + 右侧人员列表）
    students: () => adminLayout('students', `
        ${adminPageHeader('新生档案管理', '左侧选择院区/院系/专业/班级，右侧显示学生详细信息',
            `<button onclick="syncStudentData()" style="${AS.btnDefault}"><i class="fas fa-sync"></i> 同步数据</button>
             <button style="${AS.btnPrimary}"><i class="fas fa-file-excel"></i> 导出档案</button>`
        )}
        <div style="padding:20px;display:flex;gap:16px;height:calc(100vh - 140px);">
            <!-- 左侧：组织架构树 -->
            <div style="width:280px;background:white;border:1px solid #E5EAF3;border-radius:8px;overflow:hidden;display:flex;flex-direction:column;">
                <!-- 树形结构头部 -->
                <div style="padding:14px 16px;border-bottom:1px solid #E5EAF3;background:#FAFBFF;">
                    <div style="font-size:14px;font-weight:600;color:#1F2D3D;margin-bottom:8px;">
                        <i class="fas fa-sitemap" style="color:#1677FF;margin-right:6px;"></i>组织架构
                    </div>
                    <div style="font-size:11px;color:#9AACBA;">
                        <i class="fas fa-info-circle"></i> 点击节点筛选学生
                    </div>
                </div>
                <!-- 树形结构内容 -->
                <div style="flex:1;overflow-y:auto;padding:12px;">
                    <!-- 全部学生 -->
                    <div onclick="selectTreeNode('all')" style="padding:8px 12px;border-radius:6px;cursor:pointer;margin-bottom:4px;background:#E6F4FF;border:1px solid #91CAFF;">
                        <div style="display:flex;align-items:center;">
                            <i class="fas fa-users" style="color:#1677FF;margin-right:8px;"></i>
                            <span style="font-size:13px;font-weight:600;color:#1677FF;">全部学生</span>
                            <span style="margin-left:auto;font-size:12px;color:#1677FF;">2,450</span>
                        </div>
                    </div>

                    <!-- 南校区 -->
                    <div style="margin-top:12px;">
                        <div onclick="toggleTreeNode('campus-south')" style="padding:8px 12px;border-radius:6px;cursor:pointer;background:#F9FAFB;margin-bottom:4px;">
                            <div style="display:flex;align-items:center;">
                                <i id="icon-campus-south" class="fas fa-chevron-down" style="color:#5B6B7A;margin-right:8px;font-size:11px;"></i>
                                <i class="fas fa-building" style="color:#1677FF;margin-right:8px;"></i>
                                <span style="font-size:13px;font-weight:600;color:#1F2D3D;">南校区</span>
                                <span style="margin-left:auto;font-size:12px;color:#5B6B7A;">1,800</span>
                            </div>
                        </div>
                        <div id="tree-campus-south" style="margin-left:20px;">
                            ${generateDepartmentTree('south', [
                                { code:'cs', name:'计算机学院', count:668, majors:[
                                    { name:'计算机应用技术', count:440, classes:['计算机2401班(45人)','计算机2402班(43人)','计算机2403班(42人)'] },
                                    { name:'软件技术', count:168, classes:['软件2401班(40人)','软件2402班(38人)'] },
                                    { name:'人工智能技术', count:60, classes:['AI2401班(60人)'] }
                                ]},
                                { code:'nu', name:'护理学院', count:569, majors:[
                                    { name:'护理', count:369, classes:['护理2401班(42人)','护理2402班(41人)','护理2403班(40人)'] },
                                    { name:'助产', count:200, classes:['助产2401班(45人)','助产2402班(42人)'] }
                                ]},
                                { code:'ec', name:'电商学院', count:342, majors:[
                                    { name:'电子商务', count:220, classes:['电商2401班(44人)','电商2402班(42人)'] },
                                    { name:'网络营销', count:122, classes:['营销2401班(42人)'] }
                                ]}
                            ])}
                        </div>
                    </div>

                    <!-- 北校区 -->
                    <div style="margin-top:8px;">
                        <div onclick="toggleTreeNode('campus-north')" style="padding:8px 12px;border-radius:6px;cursor:pointer;background:#F9FAFB;margin-bottom:4px;">
                            <div style="display:flex;align-items:center;">
                                <i id="icon-campus-north" class="fas fa-chevron-down" style="color:#5B6B7A;margin-right:8px;font-size:11px;"></i>
                                <i class="fas fa-building" style="color:#52C41A;margin-right:8px;"></i>
                                <span style="font-size:13px;font-weight:600;color:#1F2D3D;">北校区</span>
                                <span style="margin-left:auto;font-size:12px;color:#5B6B7A;">650</span>
                            </div>
                        </div>
                        <div id="tree-campus-north" style="margin-left:20px;">
                            ${generateDepartmentTree('north', [
                                { code:'me', name:'机电学院', count:284, majors:[
                                    { name:'机电一体化', count:160, classes:['机电2401班(40人)','机电2402班(38人)'] },
                                    { name:'电气自动化', count:124, classes:['电气2401班(42人)'] }
                                ]},
                                { code:'ar', name:'建筑学院', count:366, majors:[
                                    { name:'建筑工程技术', count:200, classes:['建工2401班(45人)','建工2402班(43人)'] },
                                    { name:'工程造价', count:166, classes:['造价2401班(44人)','造价2402班(40人)'] }
                                ]}
                            ])}
                        </div>
                    </div>
                </div>
            </div>

            <!-- 右侧：人员列表 -->
            <div style="flex:1;display:flex;flex-direction:column;overflow:hidden;">
                <!-- 统计卡片 -->
                <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:16px;">
                    <div style="background:white;border:1px solid #E5EAF3;border-radius:8px;padding:14px;">
                        <div style="font-size:12px;color:#5B6B7A;margin-bottom:4px;">总人数</div>
                        <div style="font-size:24px;font-weight:600;color:#1F2D3D;">2,450</div>
                    </div>
                    <div style="background:white;border:1px solid #E5EAF3;border-radius:8px;padding:14px;">
                        <div style="font-size:12px;color:#5B6B7A;margin-bottom:4px;">男生</div>
                        <div style="font-size:24px;font-weight:600;color:#1677FF;">1,320</div>
                    </div>
                    <div style="background:white;border:1px solid #E5EAF3;border-radius:8px;padding:14px;">
                        <div style="font-size:12px;color:#5B6B7A;margin-bottom:4px;">女生</div>
                        <div style="font-size:24px;font-weight:600;color:#FA8C16;">1,130</div>
                    </div>
                    <div style="background:white;border:1px solid #E5EAF3;border-radius:8px;padding:14px;">
                        <div style="font-size:12px;color:#5B6B7A;margin-bottom:4px;">已报到</div>
                        <div style="font-size:24px;font-weight:600;color:#52C41A;">2,203</div>
                    </div>
                </div>

                <!-- 筛选栏 -->
                <div style="background:white;border:1px solid #E5EAF3;border-radius:8px;padding:14px 16px;margin-bottom:16px;">
                    <div style="display:flex;gap:10px;flex-wrap:wrap;align-items:center;">
                        <input style="${AS.input}width:240px;" placeholder="搜索姓名/身份证/考生号" />
                        <select style="${AS.input}width:120px;">
                            <option>全部性别</option>
                            <option>男</option>
                            <option>女</option>
                        </select>
                        <select style="${AS.input}width:140px;">
                            <option>全部招生类型</option>
                            <option>单招</option>
                            <option>3+2</option>
                            <option>普通高考</option>
                        </select>
                        <button style="${AS.btnPrimary}"><i class="fas fa-search"></i> 查询</button>
                        <button style="${AS.btnDefault}">重置</button>
                    </div>
                </div>

                <!-- 人员列表表格 -->
                <div style="flex:1;background:white;border:1px solid #E5EAF3;border-radius:8px;overflow:hidden;display:flex;flex-direction:column;">
                    <div style="overflow-x:auto;overflow-y:auto;flex:1;">
                        <table style="width:100%;border-collapse:collapse;font-size:13px;">
                            <thead style="position:sticky;top:0;background:#F9FAFB;z-index:10;">
                                <tr>
                                    ${['序号','姓名','性别','身份证号','考生号','招生类型','录取院系','录取专业','班级','宿舍号','操作'].map(h => `
                                        <th style="padding:12px 16px;text-align:left;color:#5B6B7A;font-weight:500;border-bottom:1px solid #E5EAF3;white-space:nowrap;">${h}</th>
                                    `).join('')}
                                </tr>
                            </thead>
                            <tbody>
                                ${generateStudentRows()}
                            </tbody>
                        </table>
                    </div>
                    <div style="padding:12px 16px;display:flex;align-items:center;justify-content:space-between;border-top:1px solid #E5EAF3;">
                        <span style="font-size:12px;color:#5B6B7A;">共 2,450 条记录</span>
                        <div style="display:flex;gap:4px;">
                            ${['«','‹','1','2','3','...','123','›','»'].map((p,i) => `
                                <button style="width:28px;height:28px;border-radius:4px;border:1px solid ${i===2?'#1677FF':'#E5EAF3'};background:${i===2?'#1677FF':'white'};color:${i===2?'white':'#5B6B7A'};font-size:12px;cursor:pointer;">${p}</button>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `),

    // 页3：基础配置中心（从迎新同步、报到步骤配置、树形院系专业）
    config: () => adminLayout('config', `
        ${adminPageHeader('基础配置中心', '从迎新系统同步基础配置、管理报到步骤、树形选择院系专业',
            `<button onclick="syncConfigData()" style="${AS.btnDefault}"><i class="fas fa-sync"></i> 同步配置</button>
             <button style="${AS.btnPrimary}"><i class="fas fa-save"></i> 保存配置</button>`
        )}
        <div style="padding:20px;">
            <!-- 学年批次管理（同步自迎新系统） -->
            <div style="${AS.card}">
                <div style="${AS.cardTitle}"><i class="fas fa-calendar-alt" style="color:#1677FF;"></i>学年批次管理
                    <span style="margin-left:auto;font-size:11px;color:#9AACBA;font-weight:400;"><i class="fas fa-info-circle"></i> 数据来源：迎新系统</span>
                </div>
                <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;">
                    ${[
                        { year:'2024', type:'单招批次', count:800, active:true },
                        { year:'2024', type:'3+2批次', count:350, active:true },
                        { year:'2024', type:'普通批次', count:1300, active:false }
                    ].map(b => `
                        <div style="border:1px solid ${b.active?'#1677FF':'#E5EAF3'};border-radius:8px;padding:14px;background:${b.active?'#F0F9FF':'white'};">
                            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">
                                <span style="font-size:14px;font-weight:600;color:${b.active?'#1677FF':'#1F2D3D'};">${b.year}${b.type}</span>
                                ${b.active ? `<span style="${AS.badge('#52C41A','#F6FFED')}">当前</span>` : ''}
                            </div>
                            <div style="font-size:12px;color:#5B6B7A;margin-bottom:10px;">已录取：${b.count} 人</div>
                            <div style="display:flex;gap:6px;">
                                <button onclick="${b.active?'':'showSuccess(\'已切换到'+b.year+b.type+'\')'}" style="padding:4px 10px;font-size:11px;background:${b.active?'white':'#1677FF'};color:${b.active?'#1677FF':'white'};border:1px solid #1677FF;border-radius:4px;cursor:pointer;">${b.active?'已激活':'切换'}</button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>

            <!-- 院系专业树形结构（同步自迎新系统） -->
            <div style="${AS.card}">
                <div style="${AS.cardTitle}"><i class="fas fa-sitemap" style="color:#1677FF;"></i>院系专业树形结构
                    <span style="margin-left:auto;">
                        <span style="font-size:11px;color:#9AACBA;font-weight:400;margin-right:12px;"><i class="fas fa-info-circle"></i> 数据来源：迎新系统</span>
                        <button onclick="toggleTreeExpand()" style="${AS.btnDefault}padding:5px 12px;font-size:12px;margin-right:6px;"><i class="fas fa-expand-alt"></i> 展开/收起</button>
                    </span>
                </div>
                <div id="dept-tree" style="border:1px solid #E5EAF3;border-radius:6px;padding:12px;background:#FAFBFF;">
                    ${[
                        { dept:'计算机学院', code:'CS', majors:[['计算机应用技术',500,440],['软件技术',200,168],['大数据技术',180,142]] },
                        { dept:'护理学院', code:'NUR', majors:[['护理',450,369],['助产',150,124]] },
                        { dept:'电商学院', code:'EC', majors:[['电子商务',400,342],['市场营销',250,203]] },
                        { dept:'机电学院', code:'ME', majors:[['机电一体化',400,284],['数控技术',200,156]] },
                        { dept:'建筑学院', code:'ARC', majors:[['建筑工程技术',250,178],['工程造价',180,123]] }
                    ].map(d => `
                        <div style="margin-bottom:8px;">
                            <div onclick="toggleDeptTree('${d.code}')" style="display:flex;align-items:center;gap:8px;padding:8px 10px;background:white;border:1px solid #E5EAF3;border-radius:6px;cursor:pointer;transition:all 0.2s;" onmouseover="this.style.borderColor='#1677FF'" onmouseout="this.style.borderColor='#E5EAF3'">
                                <i id="tree-icon-${d.code}" class="fas fa-chevron-right" style="color:#9AACBA;font-size:10px;transition:transform 0.2s;"></i>
                                <i class="fas fa-building" style="color:#1677FF;font-size:14px;"></i>
                                <span style="font-size:13px;font-weight:600;color:#1F2D3D;">${d.dept}</span>
                                <span style="${AS.badge('#1677FF','#E6F4FF')}">${d.majors.length} 个专业</span>
                                <span style="margin-left:auto;font-size:12px;color:#5B6B7A;">招生 ${d.majors.reduce((sum,[n,t])=>sum+t,0)} / 报到 ${d.majors.reduce((sum,[n,t,r])=>sum+r,0)}</span>
                            </div>
                            <div id="tree-content-${d.code}" style="display:none;margin-left:28px;margin-top:6px;">
                                ${d.majors.map(([major,total,reg]) => `
                                    <div style="display:flex;align-items:center;gap:8px;padding:8px 10px;background:#F9FAFB;border:1px solid #F0F2F5;border-radius:4px;margin-bottom:4px;">
                                        <i class="fas fa-graduation-cap" style="color:#52C41A;font-size:12px;"></i>
                                        <span style="font-size:12px;color:#1F2D3D;flex:1;">${major}</span>
                                        <span style="font-size:11px;color:#5B6B7A;">招生 ${total}</span>
                                        <span style="font-size:11px;color:#52C41A;">报到 ${reg}</span>
                                        <span style="font-size:11px;color:#9AACBA;">${Math.round(reg/total*100)}%</span>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>

            <!-- 报到步骤配置 -->
            <div style="${AS.card}">
                <div style="${AS.cardTitle}">
                    <i class="fas fa-list-ol" style="color:#1677FF;"></i>报到步骤配置
                    <span style="margin-left:auto;display:flex;gap:8px;">
                        <span style="font-size:11px;color:#9AACBA;font-weight:400;line-height:28px;"><i class="fas fa-grip-vertical"></i> 可拖拽排序</span>
                        <button onclick="addReportStep()" style="${AS.btnPrimary}padding:5px 12px;font-size:12px;">
                            <i class="fas fa-plus"></i> 添加步骤
                        </button>
                    </span>
                </div>
                <!-- 步骤说明 -->
                <div style="background:#E6F4FF;border:1px solid #91CAFF;border-radius:6px;padding:10px 12px;margin-bottom:14px;font-size:12px;color:#1677FF;">
                    <i class="fas fa-info-circle"></i> 步骤配置将实时同步到学生端，学生报到时按此顺序依次完成。必填步骤不可跳过。
                </div>
                <!-- 步骤列表 -->
                <div id="steps-config-list">
                    ${renderStepsList()}
                </div>
                <!-- 步骤统计 -->
                <div style="margin-top:12px;padding:10px 14px;background:#F9FAFB;border-radius:6px;display:flex;gap:20px;font-size:12px;color:#5B6B7A;">
                    <span><i class="fas fa-list-ol" style="color:#1677FF;"></i> 共 <strong id="step-total-count">7</strong> 个步骤</span>
                    <span><i class="fas fa-check-circle" style="color:#52C41A;"></i> 已启用 <strong id="step-enabled-count">7</strong> 个</span>
                    <span><i class="fas fa-exclamation-circle" style="color:#FF4D4F;"></i> 必填 <strong id="step-required-count">7</strong> 个</span>
                </div>
            </div>
        </div>
    `),

    // 页4：分班管理（院系组织树 + 学年人数 + 按院系分班）
    class: () => adminLayout('class', `
        ${adminPageHeader('分班管理', '左侧按院系组织树选择范围，查看全校/院系学年人数并分班',
            `<button style="${AS.btnDefault}"><i class="fas fa-magic"></i> 自动分班</button>
             <button style="${AS.btnPrimary}"><i class="fas fa-save"></i> 确认分班结果</button>`
        )}
        <div style="padding:20px;display:flex;gap:16px;align-items:flex-start;">
            <!-- 左侧：院系组织树 -->
            <div style="width:280px;min-width:280px;background:white;border:1px solid #E5EAF3;border-radius:8px;overflow:hidden;display:flex;flex-direction:column;">
                <div style="padding:14px 16px;border-bottom:1px solid #E5EAF3;background:#FAFBFF;">
                    <div style="font-size:14px;font-weight:600;color:#1F2D3D;margin-bottom:10px;"><i class="fas fa-sitemap" style="color:#1677FF;margin-right:6px;"></i>院系组织树</div>
                    <label style="font-size:11px;color:#9AACBA;display:block;margin-bottom:4px;">学年</label>
                    <select onchange="changeClassYear(this.value)" style="${AS.input}width:100%;font-size:12px;">
                        <option>2024 学年</option><option>2023 学年</option><option>2022 学年</option>
                    </select>
                </div>
                <div style="flex:1;overflow-y:auto;padding:12px;max-height:calc(100vh - 230px);">
                    ${genClassTree()}
                </div>
            </div>
            <!-- 右侧：随树联动 -->
            <div id="classScopeContent" style="flex:1;min-width:0;">
                ${renderClassScope('all')}
            </div>
        </div>
    `),

    // 页5：学号管理模块
    studentno: () => adminLayout('studentno', `
        ${adminPageHeader('学号管理', '配置学号生成规则、批量生成学号、手动调整学号',
            `<button onclick="previewStudentNo()" style="${AS.btnDefault}"><i class="fas fa-eye"></i> 预览学号</button>
             <button onclick="generateStudentNo()" style="${AS.btnPrimary}"><i class="fas fa-play"></i> 批量生成学号</button>`
        )}
        <div style="padding:20px;">
            <!-- 学号生成方案列表 -->
            <div style="${AS.card}">
                <div style="${AS.cardTitle}">
                    <i class="fas fa-list" style="color:#1677FF;"></i>学号生成方案
                    <span style="margin-left:auto;">
                        <button onclick="addStudentNoRule()" style="${AS.btnPrimary}padding:5px 12px;font-size:12px;">
                            <i class="fas fa-plus"></i> 新增方案
                        </button>
                    </span>
                </div>
                <div style="border:1px solid #E5EAF3;border-radius:6px;overflow:hidden;">
                    <table style="width:100%;border-collapse:collapse;font-size:13px;">
                        <tr style="background:#F9FAFB;">
                            ${['方案名称','方案示例','创建时间','状态','操作'].map(h => 
                                `<th style="padding:10px 14px;text-align:left;color:#5B6B7A;font-weight:500;border-bottom:1px solid #E5EAF3;">${h}</th>`
                            ).join('')}
                        </tr>
                        ${[
                            ['2024年入学学号方案', '2024 + 01(学院) + 001(专业) + 001(序号) = 202401001001', '2024-08-01 10:00', '当前使用', true],
                            ['2023年入学学号方案', '2023 + 02(学院) + 015(专业) + 045(序号) = 202302015045', '2023-08-01 09:30', '已停用', false]
                        ].map(([name, example, time, status, active]) => `
                            <tr style="border-bottom:1px solid #F0F2F5;" onmouseover="this.style.background='#FAFBFF'" onmouseout="this.style.background='white'">
                                <td style="padding:10px 14px;font-weight:500;color:#1F2D3D;">${name}</td>
                                <td style="padding:10px 14px;color:#5B6B7A;font-size:12px;font-family:monospace;">${example}</td>
                                <td style="padding:10px 14px;color:#9AACBA;font-size:12px;">${time}</td>
                                <td style="padding:10px 14px;">
                                    <span style="${AS.badge(active?'#52C41A':'#9AACBA', active?'#F6FFED':'#F5F7FA')}">${status}</span>
                                </td>
                                <td style="padding:10px 14px;">
                                    <button onclick="editStudentNoRule('${name}')" style="padding:3px 8px;font-size:11px;background:white;color:#1677FF;border:1px solid #1677FF;border-radius:4px;cursor:pointer;margin-right:4px;">编辑</button>
                                    <button onclick="copyStudentNoRule('${name}')" style="padding:3px 8px;font-size:11px;background:white;color:#52C41A;border:1px solid #52C41A;border-radius:4px;cursor:pointer;margin-right:4px;">复制</button>
                                    ${!active ? `<button onclick="deleteStudentNoRule('${name}')" style="padding:3px 8px;font-size:11px;background:white;color:#FF4D4F;border:1px solid #FF4D4F;border-radius:4px;cursor:pointer;">删除</button>` : ''}
                                </td>
                            </tr>
                        `).join('')}
                    </table>
                </div>
            </div>

            <!-- 学号生成规则配置 -->
            <div style="${AS.card}">
                <div style="${AS.cardTitle}"><i class="fas fa-cog" style="color:#1677FF;"></i>学号生成规则配置（当前方案）</div>
                
                <!-- 规则元素列表 -->
                <div style="background:#F9FAFB;border-radius:6px;padding:14px;margin-bottom:12px;">
                    <div style="font-size:12px;color:#5B6B7A;margin-bottom:10px;">学号构成要素（按顺序组合）</div>
                    ${[
                        { type: '常量型', value: '2024', desc: '入学年份（固定值）', icon: 'fas fa-font', color: '#1677FF' },
                        { type: '关联型', value: '{学院代码}', desc: '根据学生所属学院自动关联', icon: 'fas fa-link', color: '#52C41A' },
                        { type: '关联型', value: '{专业代码}', desc: '根据学生所属专业自动关联', icon: 'fas fa-link', color: '#52C41A' },
                        { type: '排序型', value: '{序号3位}', desc: '按报到顺序递增，不足补0', icon: 'fas fa-sort-numeric-up', color: '#FA8C16' }
                    ].map((rule, idx) => `
                        <div style="display:flex;align-items:center;gap:10px;background:white;border:1px solid #E5EAF3;border-radius:6px;padding:10px 12px;margin-bottom:6px;">
                            <div style="width:28px;height:28px;background:${rule.color}15;border-radius:6px;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                                <i class="${rule.icon}" style="color:${rule.color};font-size:13px;"></i>
                            </div>
                            <div style="flex:1;">
                                <div style="font-size:13px;font-weight:500;color:#1F2D3D;margin-bottom:2px;">
                                    要素 ${idx + 1}：<span style="color:${rule.color};">${rule.type}</span> - ${rule.value}
                                </div>
                                <div style="font-size:11px;color:#9AACBA;">${rule.desc}</div>
                            </div>
                            <button style="padding:4px 8px;background:white;border:1px solid #E5EAF3;border-radius:4px;color:#5B6B7A;font-size:11px;cursor:pointer;">
                                <i class="fas fa-edit"></i> 编辑
                            </button>
                            <button style="padding:4px 8px;background:white;border:1px solid #E5EAF3;border-radius:4px;color:#FF4D4F;font-size:11px;cursor:pointer;">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    `).join('')}
                    <button onclick="addRuleElement()" style="width:100%;padding:8px;background:white;border:1px dashed #91CAFF;border-radius:6px;color:#1677FF;font-size:12px;cursor:pointer;transition:all 0.2s;" onmouseover="this.style.background='#F0F9FF'" onmouseout="this.style.background='white'">
                        <i class="fas fa-plus"></i> 添加规则要素
                    </button>
                </div>

                <!-- 生成示例 -->
                <div style="background:#E6F4FF;border:1px solid #91CAFF;border-radius:6px;padding:14px;">
                    <div style="font-size:12px;color:#5B6B7A;margin-bottom:8px;"><i class="fas fa-lightbulb"></i> 学号生成示例</div>
                    <div style="font-family:monospace;font-size:14px;color:#1677FF;font-weight:600;">
                        2024 + 01 + 001 + 001 = <span style="font-size:16px;">202401001001</span>
                    </div>
                    <div style="font-size:11px;color:#5B6B7A;margin-top:6px;">
                        说明：2024年入学 + 计算机学院(01) + 计算机应用技术(001) + 第1位报到学生
                    </div>
                </div>
            </div>

            <!-- 批量生成设置 -->
            <div style="${AS.card}">
                <div style="${AS.cardTitle}"><i class="fas fa-tasks" style="color:#1677FF;"></i>批量生成设置</div>
                <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:14px;">
                    <div>
                        <label style="font-size:12px;color:#5B6B7A;margin-bottom:4px;display:block;">选择学年批次</label>
                        <select style="${AS.input}width:100%;">
                            <option>2024年单招批次</option>
                            <option>2024年3+2批次</option>
                            <option>2024年普通批次</option>
                        </select>
                    </div>
                    <div>
                        <label style="font-size:12px;color:#5B6B7A;margin-bottom:4px;display:block;">筛选条件</label>
                        <select style="${AS.input}width:100%;">
                            <option>仅已报到学生</option>
                            <option>所有已缴费学生</option>
                            <option>所有录取学生</option>
                        </select>
                    </div>
                    <div>
                        <label style="font-size:12px;color:#5B6B7A;margin-bottom:4px;display:block;">生成方式</label>
                        <select style="${AS.input}width:100%;">
                            <option>自动生成（推荐）</option>
                            <option>跳过已有学号</option>
                            <option>覆盖现有学号</option>
                        </select>
                    </div>
                </div>
                
                <!-- 统计信息 -->
                <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;">
                    ${[
                        ['待生成学号', '482', '#1677FF', '#E6F4FF'],
                        ['已有学号', '1,968', '#52C41A', '#F6FFED'],
                        ['生成失败', '0', '#FF4D4F', '#FFF1F0'],
                        ['总学生数', '2,450', '#5B6B7A', '#F9FAFB']
                    ].map(([label, value, color, bg]) => `
                        <div style="background:${bg};border-radius:6px;padding:12px;border:1px solid ${color}20;">
                            <div style="font-size:11px;color:#9AACBA;margin-bottom:4px;">${label}</div>
                            <div style="font-size:20px;font-weight:600;color:${color};">${value}</div>
                        </div>
                    `).join('')}
                </div>
            </div>

            <!-- 手动调整学号 -->
            <div style="${AS.card}">
                <div style="${AS.cardTitle}"><i class="fas fa-edit" style="color:#1677FF;"></i>手动调整学号</div>
                <div style="background:#FFF7E6;border:1px solid #FFD591;border-radius:6px;padding:10px 12px;margin-bottom:12px;font-size:12px;color:#FA8C16;">
                    <i class="fas fa-exclamation-triangle"></i> 手动修改学号后，可能影响学号规则的连续性，请谨慎操作
                </div>
                <div style="display:flex;gap:8px;margin-bottom:12px;">
                    <input style="${AS.input}flex:1;" placeholder="输入考生号/身份证号/姓名搜索" />
                    <button style="${AS.btnPrimary}padding:8px 16px;"><i class="fas fa-search"></i> 搜索</button>
                </div>
                <table style="width:100%;border-collapse:collapse;font-size:13px;">
                    <tr style="background:#F9FAFB;">
                        ${['姓名','考生号','院系专业','班级','当前学号','操作'].map(h => 
                            `<th style="padding:10px 14px;text-align:left;color:#5B6B7A;font-weight:500;border-bottom:1px solid #E5EAF3;">${h}</th>`
                        ).join('')}
                    </tr>
                    ${[
                        ['张小明', '130621202410001', '计算机学院/计算机应用技术', '计算机2401', '202401001001'],
                        ['王建国', '130621202410002', '护理学院/护理', '护理2401', '202402001001'],
                        ['刘思宇', '130621202410003', '电商学院/电子商务', '电商2401', '202403001001']
                    ].map(([name, examNo, dept, cls, studentNo]) => `
                        <tr style="border-bottom:1px solid #F0F2F5;" onmouseover="this.style.background='#FAFBFF'" onmouseout="this.style.background='white'">
                            <td style="padding:10px 14px;font-weight:500;color:#1F2D3D;">${name}</td>
                            <td style="padding:10px 14px;color:#5B6B7A;font-size:12px;">${examNo}</td>
                            <td style="padding:10px 14px;color:#5B6B7A;font-size:12px;">${dept}</td>
                            <td style="padding:10px 14px;color:#1F2D3D;">${cls}</td>
                            <td style="padding:10px 14px;font-family:monospace;color:#1677FF;font-weight:500;">${studentNo}</td>
                            <td style="padding:10px 14px;">
                                <button onclick="editSingleStudentNo('${examNo}')" style="padding:3px 10px;background:white;color:#1677FF;border:1px solid #1677FF;border-radius:4px;font-size:12px;cursor:pointer;">
                                    <i class="fas fa-edit"></i> 修改
                                </button>
                            </td>
                        </tr>
                    `).join('')}
                </table>
            </div>
        </div>
    `),

    // 页6：一卡通管理
    card: () => adminLayout('card', `
        ${adminPageHeader('一卡通管理', '一卡通信息录入、领取状态跟踪、数据统计',
            `<button onclick="importCardData()" style="${AS.btnDefault}"><i class="fas fa-file-import"></i> 批量导入</button>
             <button style="${AS.btnPrimary}"><i class="fas fa-file-excel"></i> 导出数据</button>`
        )}
        <div style="padding:20px;">
            <!-- 统计卡片 -->
            <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:20px;">
                ${[
                    ['总学生数', '2,450', '2024届新生', '#1677FF', '#E6F4FF', 'fas fa-users'],
                    ['已办理', '1,968', '办理率 80.3%', '#52C41A', '#F6FFED', 'fas fa-check-circle'],
                    ['已领取', '1,755', '领取率 71.6%', '#1677FF', '#E6F4FF', 'fas fa-hand-holding'],
                    ['待办理', '482', '占比 19.7%', '#FA8C16', '#FFF7E6', 'fas fa-clock']
                ].map(([label, value, desc, color, bg, icon]) => `
                    <div style="${AS.card}margin-bottom:0;display:flex;align-items:center;gap:14px;">
                        <div style="width:48px;height:48px;background:${bg};border-radius:10px;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                            <i class="${icon}" style="color:${color};font-size:20px;"></i>
                        </div>
                        <div style="flex:1;">
                            <div style="font-size:11px;color:#9AACBA;margin-bottom:4px;">${label}</div>
                            <div style="font-size:20px;font-weight:700;color:${color};margin-bottom:2px;">${value}</div>
                            <div style="font-size:10px;color:#9AACBA;">${desc}</div>
                        </div>
                    </div>
                `).join('')}
            </div>

            <!-- 一卡通办理趋势 -->
            <div style="${AS.card}">
                <div style="${AS.cardTitle}"><i class="fas fa-chart-line" style="color:#1677FF;"></i>一卡通办理趋势</div>
                <div style="height:180px;display:flex;align-items:flex-end;gap:6px;padding:0 10px;">
                    ${[450, 520, 380, 610, 490, 560, 650, 580, 520, 480, 420, 380, 290, 180].map((value, i) => {
                        const height = (value / 650) * 160;
                        const date = new Date();
                        date.setDate(date.getDate() - 13 + i);
                        return `
                            <div style="flex:1;display:flex;flex-direction:column;align-items:center;">
                                <div style="width:100%;background:linear-gradient(to top, #1677FF, #4096FF);border-radius:4px 4px 0 0;height:${height}px;position:relative;" title="${value}人">
                                    <div style="position:absolute;top:-18px;left:50%;transform:translateX(-50%);font-size:10px;color:#1677FF;font-weight:600;white-space:nowrap;">${value}</div>
                                </div>
                                <div style="font-size:9px;color:#9AACBA;margin-top:4px;">${date.getMonth()+1}/${date.getDate()}</div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>

            <!-- 筛选栏 -->
            <div style="${AS.card}padding:14px 16px;margin-bottom:16px;">
                <div style="display:flex;gap:10px;flex-wrap:wrap;align-items:center;">
                    <input style="${AS.input}width:220px;" placeholder="搜索姓名/学号/身份证/考生号" />
                    <select style="${AS.input}">
                        <option>全部状态</option>
                        <option>已办理</option>
                        <option>已领取</option>
                        <option>待办理</option>
                    </select>
                    <select style="${AS.input}">
                        <option>全部学院</option>
                        <option>计算机学院</option>
                        <option>护理学院</option>
                        <option>电商学院</option>
                        <option>机电学院</option>
                        <option>建筑学院</option>
                    </select>
                    <select style="${AS.input}">
                        <option>全部班级</option>
                        <option>计算机2401</option>
                        <option>计算机2402</option>
                        <option>护理2401</option>
                    </select>
                    <button style="${AS.btnPrimary}"><i class="fas fa-search"></i> 查询</button>
                    <button style="${AS.btnDefault}">重置</button>
                </div>
            </div>

            <!-- 一卡通列表 -->
            <div style="${AS.card}padding:0;">
                <table style="width:100%;border-collapse:collapse;font-size:13px;">
                    <tr style="background:#F9FAFB;">
                        ${['学号','姓名','身份证号','院系','专业','班级','一卡通号','办理状态','领取状态','办理时间','操作'].map(h => 
                            `<th style="padding:11px 14px;text-align:left;color:#5B6B7A;font-weight:500;border-bottom:1px solid #E5EAF3;">${h}</th>`
                        ).join('')}
                    </tr>
                    ${[
                        ['202401001001', '张小明', '130621199906150012', '计算机学院', '计算机应用技术', '计算机2401', '202401001', '已办理', '已领取', '2024-09-01 09:15'],
                        ['202402001001', '王建国', '130621199905220034', '护理学院', '护理', '护理2401', '202402001', '已办理', '已领取', '2024-09-01 09:18'],
                        ['202403001001', '刘思宇', '130621199907080056', '电商学院', '电子商务', '电商2401', '202403001', '已办理', '未领取', '2024-09-01 09:25'],
                        ['202401002001', '陈晓峰', '130621199908120078', '计算机学院', '软件技术', '计算机2402', '', '待办理', '未领取', '-'],
                        ['202402002001', '赵美丽', '130621199909050090', '护理学院', '助产', '护理2402', '202402002', '已办理', '未领取', '2024-09-01 10:05']
                    ].map(([studentNo, name, idCard, dept, major, cls, cardNo, status, received, time]) => {
                        const isIssued = status === '已办理';
                        const isReceived = received === '已领取';
                        return `
                            <tr style="border-bottom:1px solid #F0F2F5;" onmouseover="this.style.background='#FAFBFF'" onmouseout="this.style.background='white'">
                                <td style="padding:10px 14px;font-family:monospace;color:#1677FF;font-weight:500;">${studentNo}</td>
                                <td style="padding:10px 14px;font-weight:500;color:#1F2D3D;">${name}</td>
                                <td style="padding:10px 14px;color:#5B6B7A;font-size:12px;font-family:monospace;">${idCard}</td>
                                <td style="padding:10px 14px;color:#5B6B7A;font-size:12px;">${dept}</td>
                                <td style="padding:10px 14px;color:#5B6B7A;font-size:12px;">${major}</td>
                                <td style="padding:10px 14px;color:#1F2D3D;">${cls}</td>
                                <td style="padding:10px 14px;font-family:monospace;color:${cardNo?'#1677FF':'#9AACBA'};font-weight:500;">${cardNo || '未分配'}</td>
                                <td style="padding:10px 14px;">
                                    <span style="${AS.badge(isIssued?'#52C41A':'#FA8C16', isIssued?'#F6FFED':'#FFF7E6')}">${status}</span>
                                </td>
                                <td style="padding:10px 14px;">
                                    <span style="${AS.badge(isReceived?'#52C41A':'#9AACBA', isReceived?'#F6FFED':'#F5F7FA')}">${received}</span>
                                </td>
                                <td style="padding:10px 14px;color:#9AACBA;font-size:12px;">${time}</td>
                                <td style="padding:10px 14px;">
                                    ${!isIssued ? `
                                        <button onclick="issueCard('${studentNo}', '${name}')" style="padding:3px 10px;background:#1677FF;color:white;border:none;border-radius:4px;font-size:12px;cursor:pointer;margin-right:4px;">
                                            <i class="fas fa-plus"></i> 办理
                                        </button>
                                    ` : ''}
                                    ${isIssued && !isReceived ? `
                                        <button onclick="markReceived('${studentNo}', '${name}')" style="padding:3px 10px;background:#52C41A;color:white;border:none;border-radius:4px;font-size:12px;cursor:pointer;">
                                            <i class="fas fa-check"></i> 标记领取
                                        </button>
                                    ` : ''}
                                    <button onclick="viewCardDetail('${studentNo}')" style="padding:3px 10px;background:white;color:#5B6B7A;border:1px solid #E5EAF3;border-radius:4px;font-size:12px;cursor:pointer;">
                                        详情
                                    </button>
                                </td>
                            </tr>
                        `;
                    }).join('')}
                </table>
                <div style="padding:12px 16px;display:flex;align-items:center;justify-content:space-between;border-top:1px solid #F0F2F5;">
                    <span style="font-size:12px;color:#5B6B7A;">共 2,450 条记录</span>
                    <div style="display:flex;gap:4px;">
                        ${['«','‹','1','2','3','...','123','›','»'].map((p,i) => `
                            <button style="width:28px;height:28px;border-radius:4px;border:1px solid ${i===2?'#1677FF':'#E5EAF3'};background:${i===2?'#1677FF':'white'};color:${i===2?'white':'#5B6B7A'};font-size:12px;cursor:pointer;">${p}</button>
                        `).join('')}
                    </div>
                </div>
            </div>
        </div>
    `),

    // 页7：缴费监控
    payment: () => adminLayout('payment', `
        ${adminPageHeader('缴费监控', '实时监控学生缴费状态、未缴费追踪、缴费配置',
            `<button style="${AS.btnDefault}"><i class="fas fa-file-excel"></i> 导出未缴费名单</button>
             <button style="${AS.btnPrimary}"><i class="fas fa-phone"></i> 批量联系</button>`
        )}
        <div style="padding:20px;">
            <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:20px;">
                ${[
                    ['应缴总数', '2,450', '2024届新生', '#1677FF', '#E6F4FF', 'fas fa-users'],
                    ['已缴清', '2,203', '缴费率 89.9%', '#52C41A', '#F6FFED', 'fas fa-check-circle'],
                    ['未缴费', '247', '占比 10.1%', '#FF4D4F', '#FFF1F0', 'fas fa-exclamation-circle'],
                    ['绿色通道', '18', '已审批通过', '#FA8C16', '#FFF7E6', 'fas fa-hand-holding-heart']
                ].map(([l,v,s,c,bg,icon]) => `
                    <div style="${AS.card}margin-bottom:0;display:flex;align-items:center;gap:14px;">
                        <div style="width:44px;height:44px;background:${bg};border-radius:10px;display:flex;align-items:center;justify-content:center;">
                            <i class="${icon}" style="color:${c};font-size:18px;"></i>
                        </div>
                        <div>
                            <div style="font-size:22px;font-weight:700;color:${c};">${v}</div>
                            <div style="font-size:12px;color:#1F2D3D;font-weight:500;">${l}</div>
                            <div style="font-size:11px;color:#9AACBA;">${s}</div>
                        </div>
                    </div>
                `).join('')}
            </div>

            <!-- 缴费配置 -->
            <div style="${AS.card}">
                <div style="${AS.cardTitle}"><i class="fas fa-cog" style="color:#1677FF;"></i>缴费配置</div>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;">
                    <div style="border:1px solid #E5EAF3;border-radius:8px;padding:14px;">
                        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">
                            <span style="font-size:13px;font-weight:600;color:#1F2D3D;">是否强制缴费后生成二维码</span>
                            <div style="width:34px;height:18px;background:#1677FF;border-radius:9px;position:relative;cursor:pointer;">
                                <div style="width:14px;height:14px;background:white;border-radius:50%;position:absolute;top:2px;right:2px;transition:all 0.2s;"></div>
                            </div>
                        </div>
                        <div style="font-size:12px;color:#5B6B7A;">开启后，学生必须完成缴费才能生成报到二维码</div>
                    </div>
                    <div style="border:1px solid #E5EAF3;border-radius:8px;padding:14px;">
                        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">
                            <span style="font-size:13px;font-weight:600;color:#1F2D3D;">张家口银行缴费链接</span>
                            <button style="padding:3px 10px;font-size:11px;background:white;color:#1677FF;border:1px solid #1677FF;border-radius:4px;cursor:pointer;">配置</button>
                        </div>
                        <div style="font-size:12px;color:#5B6B7A;">当前：https://pay.zjkbank.com/bdvtc2024</div>
                    </div>
                </div>
            </div>

            <!-- 费用配置 -->
            <div style="${AS.card}">
                <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;">
                    <div style="${AS.cardTitle}margin-bottom:0;"><i class="fas fa-yen-sign" style="color:#1677FF;"></i>费用配置</div>
                    <div style="display:flex;gap:8px;">
                        <button onclick="addFeeRule()" style="${AS.btnDefault}font-size:12px;padding:5px 12px;"><i class="fas fa-plus"></i> 新增专业费用</button>
                        <button onclick="saveFeeConfig()" style="${AS.btnPrimary}font-size:12px;padding:5px 14px;"><i class="fas fa-save"></i> 保存</button>
                    </div>
                </div>

                <!-- 宿舍费用说明 -->
                <div style="background:#E6F4FF;border:1px solid #91CAFF;border-radius:8px;padding:12px 14px;margin-bottom:16px;">
                    <div style="font-size:12px;font-weight:600;color:#1677FF;margin-bottom:8px;"><i class="fas fa-info-circle"></i> 宿舍费用规则：统一按8人间收费，入住4人间补差价，退宿或调整后多退少补</div>
                    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;">
                        ${[
                            { label:'8人间（标准）', id:'dorm8', val:'1,200', unit:'元/年', color:'#1677FF' },
                            { label:'4人间（差价补收）', id:'dorm4', val:'1,800', unit:'元/年', color:'#FA8C16' },
                            { label:'差价（4人间-8人间）', id:'dormDiff', val:'600', unit:'元/年', color:'#52C41A', readonly:true },
                        ].map(d => `
                            <div style="border:1px solid ${d.color}30;border-radius:6px;padding:10px 12px;background:white;">
                                <div style="font-size:11px;color:#9AACBA;margin-bottom:6px;">${d.label}</div>
                                <div style="display:flex;align-items:center;gap:4px;">
                                    <span style="font-size:13px;color:#9AACBA;">¥</span>
                                    <input id="fee-${d.id}" type="text" value="${d.val}"
                                        ${d.readonly ? 'readonly' : 'oninput="calcDormDiff()"'}
                                        style="flex:1;width:0;padding:5px 8px;border:1px solid ${d.readonly?'#F0F2F5':'#E5EAF3'};border-radius:5px;font-size:14px;font-weight:700;color:${d.color};outline:none;background:${d.readonly?'#F9FAFB':'white'};" />
                                    <span style="font-size:11px;color:#9AACBA;white-space:nowrap;">${d.unit}</span>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- 专业学费配置表 -->
                <div style="border:1px solid #E5EAF3;border-radius:8px;overflow:hidden;">
                    <div style="padding:10px 14px;background:#F9FAFB;border-bottom:1px solid #E5EAF3;display:flex;align-items:center;gap:10px;">
                        <span style="font-size:12px;font-weight:600;color:#1F2D3D;flex:1;">各专业学费配置</span>
                        <span style="font-size:11px;color:#9AACBA;">其他费用（军训、教材等）在下方统一配置</span>
                    </div>
                    <table style="width:100%;border-collapse:collapse;font-size:13px;" id="fee-major-table">
                        <tr style="background:#FAFBFF;">
                            ${['院系','专业','招生批次','学费（元/年）','备注','操作'].map(h=>`<th style="padding:10px 14px;text-align:left;color:#5B6B7A;font-weight:500;border-bottom:1px solid #F0F2F5;white-space:nowrap;">${h}</th>`).join('')}
                        </tr>
                        ${[
                            { dept:'计算机学院', major:'计算机应用技术', batch:'单招/3+2/普通', fee:'5,000', note:'' },
                            { dept:'计算机学院', major:'大数据技术',      batch:'单招/普通',    fee:'5,200', note:'' },
                            { dept:'护理学院',   major:'护理',            batch:'单招/3+2/普通', fee:'5,500', note:'含护士执照考试费' },
                            { dept:'护理学院',   major:'助产',            batch:'单招/普通',     fee:'5,500', note:'' },
                            { dept:'电商学院',   major:'电子商务',        batch:'单招/普通',     fee:'4,800', note:'' },
                            { dept:'机电学院',   major:'机电一体化',      batch:'单招/普通',     fee:'5,000', note:'' },
                        ].map((r,i) => `
                            <tr id="fee-row-${i}" style="border-bottom:1px solid #F0F2F5;" onmouseover="this.style.background='#FAFBFF'" onmouseout="this.style.background='white'">
                                <td style="padding:9px 14px;color:#5B6B7A;font-size:12px;">${r.dept}</td>
                                <td style="padding:9px 14px;font-weight:500;">${r.major}</td>
                                <td style="padding:9px 14px;font-size:12px;color:#5B6B7A;">${r.batch}</td>
                                <td style="padding:9px 14px;">
                                    <div style="display:flex;align-items:center;gap:4px;">
                                        <span style="color:#9AACBA;font-size:12px;">¥</span>
                                        <input type="text" value="${r.fee}" style="width:80px;padding:4px 8px;border:1px solid #E5EAF3;border-radius:4px;font-size:13px;font-weight:600;color:#1677FF;outline:none;text-align:right;" />
                                    </div>
                                </td>
                                <td style="padding:9px 14px;">
                                    <input type="text" value="${r.note}" placeholder="备注（选填）" style="width:120px;padding:4px 8px;border:1px solid #E5EAF3;border-radius:4px;font-size:12px;color:#5B6B7A;outline:none;" />
                                </td>
                                <td style="padding:9px 14px;">
                                    <button onclick="deleteFeeRow(${i})" style="padding:3px 8px;background:white;color:#FF4D4F;border:1px solid #FFCCC7;border-radius:4px;font-size:11px;cursor:pointer;"><i class="fas fa-trash-alt"></i></button>
                                </td>
                            </tr>
                        `).join('')}
                    </table>
                </div>

                <!-- 其他固定费用 -->
                <div style="border:1px solid #E5EAF3;border-radius:8px;overflow:hidden;margin-top:14px;">
                    <div style="padding:10px 14px;background:#F9FAFB;border-bottom:1px solid #E5EAF3;">
                        <span style="font-size:12px;font-weight:600;color:#1F2D3D;">其他统一收费项</span>
                        <span style="font-size:11px;color:#9AACBA;margin-left:8px;">所有学生统一收取</span>
                    </div>
                    <div style="padding:14px;display:flex;flex-direction:column;gap:10px;">
                        ${[
                            { label:'军训费',   id:'fee-army',  val:'150' },
                            { label:'教材资料费', id:'fee-book', val:'300' },
                        ].map(f => `
                            <div style="display:flex;align-items:center;gap:12px;">
                                <span style="font-size:13px;color:#1F2D3D;width:90px;flex-shrink:0;">${f.label}</span>
                                <div style="display:flex;align-items:center;gap:4px;flex:1;max-width:180px;">
                                    <span style="font-size:13px;color:#9AACBA;">¥</span>
                                    <input id="${f.id}" type="text" value="${f.val}" style="flex:1;padding:6px 10px;border:1px solid #E5EAF3;border-radius:5px;font-size:13px;font-weight:600;color:#1F2D3D;outline:none;" />
                                    <span style="font-size:12px;color:#9AACBA;white-space:nowrap;">元/人</span>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- 多退少补说明 -->
                <div style="background:#FFF7E6;border:1px solid #FFD591;border-radius:8px;padding:10px 14px;margin-top:14px;">
                    <div style="font-size:12px;color:#D48806;line-height:1.8;">
                        <i class="fas fa-exclamation-circle"></i>
                        <strong> 多退少补规则：</strong>报到时统一按8人间宿舍费收取；
                        分配或申请4人间后，系统自动生成差价补缴通知（¥600）；
                        退宿或调整至更低档位后，差额于学期末退还。
                    </div>
                </div>
            </div>

            <script>
            function calcDormDiff() {
                const v8 = parseInt((document.getElementById('fee-dorm8')?.value||'').replace(/,/g,''))||0;
                const v4 = parseInt((document.getElementById('fee-dorm4')?.value||'').replace(/,/g,''))||0;
                const diff = Math.max(0, v4 - v8);
                const el = document.getElementById('fee-dormDiff');
                if (el) el.value = diff.toLocaleString();
            }
            function saveFeeConfig() {
                showSuccess('费用配置已保存');
            }
            function addFeeRule() {
                showModal(\`
                    <div style="padding:18px 20px;border-bottom:1px solid #E5EAF3;">
                        <div style="font-size:15px;font-weight:600;color:#1F2D3D;">新增专业学费</div>
                    </div>
                    <div style="padding:20px;display:flex;flex-direction:column;gap:12px;">
                        <div>
                            <label style="display:block;font-size:12px;color:#5B6B7A;margin-bottom:5px;">院系 <span style="color:#FF4D4F;">*</span></label>
                            <select id="nf-dept" style="width:100%;padding:8px 12px;border:1px solid #E5EAF3;border-radius:6px;font-size:13px;outline:none;">
                                <option>计算机学院</option><option>护理学院</option><option>电商学院</option><option>机电学院</option><option>其他</option>
                            </select>
                        </div>
                        <div>
                            <label style="display:block;font-size:12px;color:#5B6B7A;margin-bottom:5px;">专业名称 <span style="color:#FF4D4F;">*</span></label>
                            <input id="nf-major" style="width:100%;padding:8px 12px;border:1px solid #E5EAF3;border-radius:6px;font-size:13px;outline:none;box-sizing:border-box;" placeholder="如：物联网技术" />
                        </div>
                        <div>
                            <label style="display:block;font-size:12px;color:#5B6B7A;margin-bottom:5px;">适用批次</label>
                            <input id="nf-batch" style="width:100%;padding:8px 12px;border:1px solid #E5EAF3;border-radius:6px;font-size:13px;outline:none;box-sizing:border-box;" placeholder="如：单招/普通" value="单招/普通" />
                        </div>
                        <div>
                            <label style="display:block;font-size:12px;color:#5B6B7A;margin-bottom:5px;">学费（元/年）<span style="color:#FF4D4F;">*</span></label>
                            <input id="nf-fee" type="number" style="width:100%;padding:8px 12px;border:1px solid #E5EAF3;border-radius:6px;font-size:13px;outline:none;box-sizing:border-box;" placeholder="如：5000" />
                        </div>
                        <div>
                            <label style="display:block;font-size:12px;color:#5B6B7A;margin-bottom:5px;">备注</label>
                            <input id="nf-note" style="width:100%;padding:8px 12px;border:1px solid #E5EAF3;border-radius:6px;font-size:13px;outline:none;box-sizing:border-box;" placeholder="选填" />
                        </div>
                    </div>
                    <div style="padding:12px 20px;border-top:1px solid #E5EAF3;display:flex;gap:8px;justify-content:flex-end;">
                        <button onclick="closeModal()" style="padding:7px 16px;background:white;color:#5B6B7A;border:1px solid #E5EAF3;border-radius:6px;font-size:13px;cursor:pointer;">取消</button>
                        <button onclick="confirmAddFeeRow()" style="padding:7px 16px;background:#1677FF;color:white;border:none;border-radius:6px;font-size:13px;cursor:pointer;">添加</button>
                    </div>
                \`);
            }
            function confirmAddFeeRow() {
                const dept  = document.getElementById('nf-dept')?.value||'';
                const major = document.getElementById('nf-major')?.value.trim()||'';
                const batch = document.getElementById('nf-batch')?.value.trim()||'单招/普通';
                const fee   = document.getElementById('nf-fee')?.value.trim()||'0';
                const note  = document.getElementById('nf-note')?.value.trim()||'';
                if (!major || !fee) { alert('请填写专业名称和学费'); return; }
                const tbody = document.getElementById('fee-major-table');
                if (tbody) {
                    const rows = tbody.querySelectorAll('tr');
                    const idx = rows.length - 1;
                    const tr = document.createElement('tr');
                    tr.style.cssText = 'border-bottom:1px solid #F0F2F5;';
                    tr.innerHTML = \`
                        <td style="padding:9px 14px;color:#5B6B7A;font-size:12px;">\${dept}</td>
                        <td style="padding:9px 14px;font-weight:500;">\${major}</td>
                        <td style="padding:9px 14px;font-size:12px;color:#5B6B7A;">\${batch}</td>
                        <td style="padding:9px 14px;"><div style="display:flex;align-items:center;gap:4px;"><span style="color:#9AACBA;font-size:12px;">¥</span><input type="text" value="\${Number(fee).toLocaleString()}" style="width:80px;padding:4px 8px;border:1px solid #E5EAF3;border-radius:4px;font-size:13px;font-weight:600;color:#1677FF;outline:none;text-align:right;"/></div></td>
                        <td style="padding:9px 14px;"><input type="text" value="\${note}" placeholder="备注" style="width:120px;padding:4px 8px;border:1px solid #E5EAF3;border-radius:4px;font-size:12px;color:#5B6B7A;outline:none;"/></td>
                        <td style="padding:9px 14px;"><button onclick="this.closest('tr').remove();showSuccess('已删除')" style="padding:3px 8px;background:white;color:#FF4D4F;border:1px solid #FFCCC7;border-radius:4px;font-size:11px;cursor:pointer;"><i class="fas fa-trash-alt"></i></button></td>
                    \`;
                    tbody.appendChild(tr);
                }
                closeModal();
                showSuccess(\`已添加：\${major}\`);
            }
            function deleteFeeRow(i) {
                const row = document.getElementById('fee-row-' + i);
                if (row) { row.remove(); showSuccess('已删除该费用规则'); }
            }
            </script>

            <!-- 未缴费追踪表 -->
            <div style="${AS.card}padding:0;">
                <div style="padding:14px 16px;border-bottom:1px solid #E5EAF3;display:flex;align-items:center;gap:10px;">
                    <input style="${AS.input}flex:1;" placeholder="搜索学号/姓名/联系电话" />
                    <select style="${AS.input}">
                        <option>全部学院</option>
                        <option>计算机学院</option>
                        <option>护理学院</option>
                    </select>
                    <button style="${AS.btnPrimary}"><i class="fas fa-search"></i> 查询</button>
                </div>
                <table style="width:100%;border-collapse:collapse;font-size:13px;">
                    <tr style="background:#F9FAFB;">
                        ${['学号','姓名','联系电话','院系专业','应缴金额','状态','操作'].map(h => `<th style="padding:11px 14px;text-align:left;color:#5B6B7A;font-weight:500;border-bottom:1px solid #E5EAF3;">${h}</th>`).join('')}
                    </tr>
                    ${[
                        { id:'202401010', name:'郑文博', phone:'135****8801', dept:'计算机学院/计算机应用', amount:'6,650', status:'未缴费' },
                        { id:'202401025', name:'周海燕', phone:'139****2234', dept:'护理学院/护理', amount:'6,650', status:'未缴费' },
                        { id:'202401038', name:'吴志强', phone:'187****5509', dept:'电商学院/电子商务', amount:'6,650', status:'未缴费' },
                        { id:'202401052', name:'冯晓慧', phone:'138****3312', dept:'机电学院/机电一体化', amount:'6,650', status:'未缴费' }
                    ].map(s => `
                        <tr style="border-bottom:1px solid #F0F2F5;" onmouseover="this.style.background='#FAFBFF'" onmouseout="this.style.background='white'">
                            <td style="padding:10px 14px;color:#5B6B7A;font-size:12px;">${s.id}</td>
                            <td style="padding:10px 14px;font-weight:500;">${s.name}</td>
                            <td style="padding:10px 14px;color:#5B6B7A;">${s.phone}</td>
                            <td style="padding:10px 14px;color:#5B6B7A;font-size:12px;">${s.dept}</td>
                            <td style="padding:10px 14px;color:#FF4D4F;font-weight:600;">${s.amount} 元</td>
                            <td style="padding:10px 14px;"><span style="${AS.badge('#FF4D4F','#FFF1F0')}">${s.status}</span></td>
                            <td style="padding:10px 14px;">
                                <button style="padding:3px 10px;background:#1677FF;color:white;border:none;border-radius:4px;font-size:12px;cursor:pointer;margin-right:4px;" onclick="alert('发送缴费提醒短信')">提醒</button>
                                <button style="padding:3px 10px;background:white;color:#5B6B7A;border:1px solid #E5EAF3;border-radius:4px;font-size:12px;cursor:pointer;" onclick="alert('查看详情')">详情</button>
                            </td>
                        </tr>
                    `).join('')}
                </table>
                <div style="padding:12px 16px;border-top:1px solid #F0F2F5;font-size:12px;color:#5B6B7A;">共 247 条未缴费记录</div>
            </div>
        </div>
    `),

    // 页8：未报到追踪
    unregistered: () => adminLayout('unregistered', `
        ${adminPageHeader('未报到追踪', '实时追踪未完成报到的新生，指派跟进负责人',
            `<button style="${AS.btnDefault}"><i class="fas fa-file-excel"></i> 导出名单</button>
             <button style="${AS.btnPrimary}"><i class="fas fa-phone"></i> 批量联系</button>`
        )}
        <div style="padding:20px;">
            <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-bottom:20px;">
                ${[
                    ['未报到总数', '482', '截至今日09:45', '#FF4D4F', '#FFF1F0', 'fas fa-user-times'],
                    ['已跟进', '267', '占未报到55.4%', '#FA8C16', '#FFF7E6', 'fas fa-phone'],
                    ['保留资格申请', '18', '待审批 5 件', '#722ED1', '#F9F0FF', 'fas fa-file-alt']
                ].map(([l,v,s,c,bg,icon]) => `
                    <div style="${AS.card}margin-bottom:0;display:flex;align-items:center;gap:14px;">
                        <div style="width:44px;height:44px;background:${bg};border-radius:10px;display:flex;align-items:center;justify-content:center;">
                            <i class="${icon}" style="color:${c};font-size:18px;"></i>
                        </div>
                        <div>
                            <div style="font-size:22px;font-weight:700;color:${c};">${v}</div>
                            <div style="font-size:12px;color:#1F2D3D;font-weight:500;">${l}</div>
                            <div style="font-size:11px;color:#9AACBA;">${s}</div>
                        </div>
                    </div>
                `).join('')}
            </div>

            <div style="${AS.card}padding:14px 16px;margin-bottom:16px;">
                <div style="display:flex;gap:10px;align-items:center;">
                    <input style="${AS.input}flex:1;" placeholder="搜索学号/姓名/联系人" />
                    <select style="${AS.input}">
                        <option>全部学院</option>
                        <option>计算机学院</option>
                        <option>护理学院</option>
                    </select>
                    <select style="${AS.input}">
                        <option>全部跟进状态</option>
                        <option>未跟进</option>
                        <option>跟进中</option>
                        <option>已确认</option>
                    </select>
                    <button style="${AS.btnPrimary}"><i class="fas fa-search"></i> 查询</button>
                </div>
            </div>

            <div style="${AS.card}padding:0;">
                <table style="width:100%;border-collapse:collapse;font-size:13px;">
                    <tr style="background:#F9FAFB;">
                        ${['学号','姓名','联系电话','原因','跟进状态','负责人','操作'].map(h => `
                            <th style="padding:11px 14px;text-align:left;color:#5B6B7A;font-weight:500;border-bottom:1px solid #E5EAF3;">${h}</th>
                        `).join('')}
                    </tr>
                    ${[
                        { id:'202401010', name:'郑文博', phone:'135****8801', reason:'交通延误', status:'跟进中', owner:'张老师' },
                        { id:'202401025', name:'周海燕', phone:'139****2234', reason:'身体不适', status:'未跟进', owner:'未指派' },
                        { id:'202401038', name:'吴志强', phone:'187****5509', reason:'主动放弃', status:'已确认', owner:'李老师' },
                        { id:'202401052', name:'冯晓慧', phone:'138****3312', reason:'家庭原因', status:'跟进中', owner:'王老师' },
                        { id:'202401063', name:'褚鑫', phone:'152****7718', reason:'未联系上', status:'未跟进', owner:'未指派' }
                    ].map(s => `
                        <tr style="border-bottom:1px solid #F0F2F5;" onmouseover="this.style.background='#FAFBFF'" onmouseout="this.style.background='white'">
                            <td style="padding:10px 14px;color:#5B6B7A;font-size:12px;">${s.id}</td>
                            <td style="padding:10px 14px;font-weight:500;">${s.name}</td>
                            <td style="padding:10px 14px;color:#5B6B7A;">${s.phone}</td>
                            <td style="padding:10px 14px;">${s.reason}</td>
                            <td style="padding:10px 14px;">
                                <span style="${AS.badge(s.status==='已确认'?'#52C41A':s.status==='跟进中'?'#1677FF':'#FF4D4F', s.status==='已确认'?'#F6FFED':s.status==='跟进中'?'#E6F4FF':'#FFF1F0')}">${s.status}</span>
                            </td>
                            <td style="padding:10px 14px;color:${s.owner==='未指派'?'#9AACBA':'#1F2D3D'};">${s.owner}</td>
                            <td style="padding:10px 14px;">
                                <button style="padding:3px 10px;background:#1677FF;color:white;border:none;border-radius:4px;font-size:12px;cursor:pointer;margin-right:4px;" onclick="alert('指派跟进负责人')">指派</button>
                                <button style="padding:3px 10px;background:white;color:#5B6B7A;border:1px solid #E5EAF3;border-radius:4px;font-size:12px;cursor:pointer;" onclick="alert('添加备注')">备注</button>
                            </td>
                        </tr>
                    `).join('')}
                </table>
                <div style="padding:12px 16px;border-top:1px solid #F0F2F5;font-size:12px;color:#5B6B7A;">共 482 条未报到记录</div>
            </div>
        </div>
    `)
};

// ============ 状态管理 ============
let currentAdminPage = 'dashboard';

function switchAdminPage(pageId) {
    currentAdminPage = pageId;
    renderAdminDashboard();
}

// ============ 渲染入口 ============
function renderAdminDashboard() {
    const contentEl = document.getElementById('admin-pc-content');
    if (!contentEl) return;

    // 渲染主内容（内嵌了含侧边栏的完整后台布局）
    const renderFn = adminPages[currentAdminPage];
    contentEl.innerHTML = renderFn ? renderFn() : `<div style="padding:40px;text-align:center;color:#9AACBA;">页面开发中...</div>`;
}

// ============ 弹窗交互函数 ============

// 显示弹窗
function showModal(content) {
    const modal = document.createElement('div');
    modal.id = 'admin-modal';
    modal.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;z-index:9999;';
    modal.innerHTML = `
        <div style="background:white;border-radius:8px;width:520px;max-height:80vh;overflow:auto;box-shadow:0 8px 32px rgba(0,0,0,0.2);">
            ${content}
        </div>
    `;
    document.body.appendChild(modal);
    modal.onclick = (e) => { if (e.target === modal) closeModal(); };
}

// 关闭弹窗
function closeModal() {
    const modal = document.getElementById('admin-modal');
    if (modal) modal.remove();
}

// 显示成功提示
function showSuccess(message) {
    const toast = document.createElement('div');
    toast.style.cssText = 'position:fixed;top:80px;left:50%;transform:translateX(-50%);background:#52C41A;color:white;padding:12px 24px;border-radius:6px;font-size:14px;z-index:10000;box-shadow:0 4px 16px rgba(82,196,26,0.3);';
    toast.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2000);
}

// 新增批次
function addBatch() {
    showModal(`
        <div style="padding:20px 24px;border-bottom:1px solid #E5EAF3;">
            <div style="font-size:16px;font-weight:600;color:#1F2D3D;">新增学年批次</div>
        </div>
        <div style="padding:24px;">
            <div style="margin-bottom:16px;">
                <label style="display:block;font-size:13px;color:#5B6B7A;margin-bottom:6px;">学年 <span style="color:#FF4D4F;">*</span></label>
                <input id="batch-year" style="width:100%;padding:8px 12px;border:1px solid #E5EAF3;border-radius:6px;font-size:13px;outline:none;" placeholder="如：2025" value="2025" />
            </div>
            <div style="margin-bottom:16px;">
                <label style="display:block;font-size:13px;color:#5B6B7A;margin-bottom:6px;">批次类型 <span style="color:#FF4D4F;">*</span></label>
                <select id="batch-type" style="width:100%;padding:8px 12px;border:1px solid #E5EAF3;border-radius:6px;font-size:13px;outline:none;">
                    <option>单招批次</option>
                    <option>3+2批次</option>
                    <option>普通批次</option>
                </select>
            </div>
            <div style="margin-bottom:16px;">
                <label style="display:block;font-size:13px;color:#5B6B7A;margin-bottom:6px;">招生计划人数</label>
                <input id="batch-count" type="number" style="width:100%;padding:8px 12px;border:1px solid #E5EAF3;border-radius:6px;font-size:13px;outline:none;" placeholder="预计招生人数" value="500" />
            </div>
        </div>
        <div style="padding:12px 24px;border-top:1px solid #E5EAF3;display:flex;gap:8px;justify-content:flex-end;">
            <button onclick="closeModal()" style="padding:7px 16px;background:white;color:#5B6B7A;border:1px solid #E5EAF3;border-radius:6px;font-size:13px;cursor:pointer;">取消</button>
            <button onclick="saveBatch()" style="padding:7px 16px;background:#1677FF;color:white;border:none;border-radius:6px;font-size:13px;cursor:pointer;">确认新增</button>
        </div>
    `);
}

function saveBatch() {
    const year = document.getElementById('batch-year').value;
    const type = document.getElementById('batch-type').value;
    closeModal();
    showSuccess(`已新增批次：${year}${type}`);
    setTimeout(() => renderAdminDashboard(), 500);
}

// 编辑批次
function editBatch(year, type) {
    showModal(`
        <div style="padding:20px 24px;border-bottom:1px solid #E5EAF3;">
            <div style="font-size:16px;font-weight:600;color:#1F2D3D;">编辑批次 - ${year}${type}</div>
        </div>
        <div style="padding:24px;">
            <div style="margin-bottom:16px;">
                <label style="display:block;font-size:13px;color:#5B6B7A;margin-bottom:6px;">学年 <span style="color:#FF4D4F;">*</span></label>
                <input style="width:100%;padding:8px 12px;border:1px solid #E5EAF3;border-radius:6px;font-size:13px;outline:none;" value="${year}" />
            </div>
            <div style="margin-bottom:16px;">
                <label style="display:block;font-size:13px;color:#5B6B7A;margin-bottom:6px;">批次类型 <span style="color:#FF4D4F;">*</span></label>
                <select style="width:100%;padding:8px 12px;border:1px solid #E5EAF3;border-radius:6px;font-size:13px;outline:none;">
                    <option ${type.includes('单招')?'selected':''}>单招批次</option>
                    <option ${type.includes('3+2')?'selected':''}>3+2批次</option>
                    <option ${type.includes('普通')?'selected':''}>普通批次</option>
                </select>
            </div>
            <div style="margin-bottom:16px;">
                <label style="display:block;font-size:13px;color:#5B6B7A;margin-bottom:6px;">状态</label>
                <div style="display:flex;gap:12px;">
                    <label style="display:flex;align-items:center;gap:6px;cursor:pointer;">
                        <input type="radio" name="status" checked /> 启用
                    </label>
                    <label style="display:flex;align-items:center;gap:6px;cursor:pointer;">
                        <input type="radio" name="status" /> 停用
                    </label>
                </div>
            </div>
        </div>
        <div style="padding:12px 24px;border-top:1px solid #E5EAF3;display:flex;gap:8px;justify-content:flex-end;">
            <button onclick="closeModal()" style="padding:7px 16px;background:white;color:#5B6B7A;border:1px solid #E5EAF3;border-radius:6px;font-size:13px;cursor:pointer;">取消</button>
            <button onclick="closeModal();showSuccess('批次信息已更新')" style="padding:7px 16px;background:#1677FF;color:white;border:none;border-radius:6px;font-size:13px;cursor:pointer;">保存</button>
        </div>
    `);
}

// 批量复制专业
function copyMajors() {
    showModal(`
        <div style="padding:20px 24px;border-bottom:1px solid #E5EAF3;">
            <div style="font-size:16px;font-weight:600;color:#1F2D3D;">批量复制院系专业</div>
        </div>
        <div style="padding:24px;">
            <div style="margin-bottom:16px;">
                <label style="display:block;font-size:13px;color:#5B6B7A;margin-bottom:6px;">源批次 <span style="color:#FF4D4F;">*</span></label>
                <select style="width:100%;padding:8px 12px;border:1px solid #E5EAF3;border-radius:6px;font-size:13px;outline:none;">
                    <option>2024单招批次</option>
                    <option>2024 3+2批次</option>
                    <option>2024普通批次</option>
                </select>
            </div>
            <div style="margin-bottom:16px;">
                <label style="display:block;font-size:13px;color:#5B6B7A;margin-bottom:6px;">目标批次 <span style="color:#FF4D4F;">*</span></label>
                <select style="width:100%;padding:8px 12px;border:1px solid #E5EAF3;border-radius:6px;font-size:13px;outline:none;">
                    <option>2025单招批次</option>
                    <option>2025 3+2批次</option>
                    <option>2025普通批次</option>
                </select>
            </div>
            <div style="background:#E6F4FF;border:1px solid #91CAFF;border-radius:6px;padding:12px;margin-bottom:16px;">
                <div style="font-size:12px;color:#1677FF;line-height:1.6;">
                    <i class="fas fa-info-circle"></i> 将复制源批次的所有院系专业配置（院系、专业、学制、招生计划）到目标批次，复制后可单独修改。
                </div>
            </div>
        </div>
        <div style="padding:12px 24px;border-top:1px solid #E5EAF3;display:flex;gap:8px;justify-content:flex-end;">
            <button onclick="closeModal()" style="padding:7px 16px;background:white;color:#5B6B7A;border:1px solid #E5EAF3;border-radius:6px;font-size:13px;cursor:pointer;">取消</button>
            <button onclick="closeModal();showSuccess('已成功复制 12 个专业配置')" style="padding:7px 16px;background:#1677FF;color:white;border:none;border-radius:6px;font-size:13px;cursor:pointer;">确认复制</button>
        </div>
    `);
}

// 新增专业
function addMajor() {
    showModal(`
        <div style="padding:20px 24px;border-bottom:1px solid #E5EAF3;">
            <div style="font-size:16px;font-weight:600;color:#1F2D3D;">新增院系专业</div>
        </div>
        <div style="padding:24px;">
            <div style="margin-bottom:16px;">
                <label style="display:block;font-size:13px;color:#5B6B7A;margin-bottom:6px;">院系 <span style="color:#FF4D4F;">*</span></label>
                <select id="major-dept" style="width:100%;padding:8px 12px;border:1px solid #E5EAF3;border-radius:6px;font-size:13px;outline:none;">
                    <option>计算机学院</option>
                    <option>护理学院</option>
                    <option>电商学院</option>
                    <option>机电学院</option>
                    <option>建筑学院</option>
                </select>
            </div>
            <div style="margin-bottom:16px;">
                <label style="display:block;font-size:13px;color:#5B6B7A;margin-bottom:6px;">专业名称 <span style="color:#FF4D4F;">*</span></label>
                <input id="major-name" style="width:100%;padding:8px 12px;border:1px solid #E5EAF3;border-radius:6px;font-size:13px;outline:none;" placeholder="如：大数据技术" />
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px;">
                <div>
                    <label style="display:block;font-size:13px;color:#5B6B7A;margin-bottom:6px;">学制 <span style="color:#FF4D4F;">*</span></label>
                    <select id="major-years" style="width:100%;padding:8px 12px;border:1px solid #E5EAF3;border-radius:6px;font-size:13px;outline:none;">
                        <option>三年</option>
                        <option>五年</option>
                    </select>
                </div>
                <div>
                    <label style="display:block;font-size:13px;color:#5B6B7A;margin-bottom:6px;">招生计划</label>
                    <input id="major-plan" type="number" style="width:100%;padding:8px 12px;border:1px solid #E5EAF3;border-radius:6px;font-size:13px;outline:none;" placeholder="人数" value="50" />
                </div>
            </div>
        </div>
        <div style="padding:12px 24px;border-top:1px solid #E5EAF3;display:flex;gap:8px;justify-content:flex-end;">
            <button onclick="closeModal()" style="padding:7px 16px;background:white;color:#5B6B7A;border:1px solid #E5EAF3;border-radius:6px;font-size:13px;cursor:pointer;">取消</button>
            <button onclick="saveMajor()" style="padding:7px 16px;background:#1677FF;color:white;border:none;border-radius:6px;font-size:13px;cursor:pointer;">确认新增</button>
        </div>
    `);
}

function saveMajor() {
    const dept = document.getElementById('major-dept').value;
    const name = document.getElementById('major-name').value;
    if (!name) {
        alert('请输入专业名称');
        return;
    }
    closeModal();
    showSuccess(`已新增专业：${dept} - ${name}`);
    setTimeout(() => renderAdminDashboard(), 500);
}

// 编辑专业
function editMajor(dept, major) {
    showModal(`
        <div style="padding:20px 24px;border-bottom:1px solid #E5EAF3;">
            <div style="font-size:16px;font-weight:600;color:#1F2D3D;">编辑专业 - ${dept} ${major}</div>
        </div>
        <div style="padding:24px;">
            <div style="margin-bottom:16px;">
                <label style="display:block;font-size:13px;color:#5B6B7A;margin-bottom:6px;">院系</label>
                <select style="width:100%;padding:8px 12px;border:1px solid #E5EAF3;border-radius:6px;font-size:13px;outline:none;">
                    <option selected>${dept}</option>
                    <option>护理学院</option>
                    <option>电商学院</option>
                </select>
            </div>
            <div style="margin-bottom:16px;">
                <label style="display:block;font-size:13px;color:#5B6B7A;margin-bottom:6px;">专业名称</label>
                <input style="width:100%;padding:8px 12px;border:1px solid #E5EAF3;border-radius:6px;font-size:13px;outline:none;" value="${major}" />
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
                <div>
                    <label style="display:block;font-size:13px;color:#5B6B7A;margin-bottom:6px;">学制</label>
                    <select style="width:100%;padding:8px 12px;border:1px solid #E5EAF3;border-radius:6px;font-size:13px;outline:none;">
                        <option selected>三年</option>
                        <option>五年</option>
                    </select>
                </div>
                <div>
                    <label style="display:block;font-size:13px;color:#5B6B7A;margin-bottom:6px;">招生计划</label>
                    <input type="number" style="width:100%;padding:8px 12px;border:1px solid #E5EAF3;border-radius:6px;font-size:13px;outline:none;" value="500" />
                </div>
            </div>
        </div>
        <div style="padding:12px 24px;border-top:1px solid #E5EAF3;display:flex;gap:8px;justify-content:flex-end;">
            <button onclick="closeModal()" style="padding:7px 16px;background:white;color:#5B6B7A;border:1px solid #E5EAF3;border-radius:6px;font-size:13px;cursor:pointer;">取消</button>
            <button onclick="closeModal();showSuccess('专业信息已更新')" style="padding:7px 16px;background:#1677FF;color:white;border:none;border-radius:6px;font-size:13px;cursor:pointer;">保存</button>
        </div>
    `);
}

// 删除专业
function deleteMajor(dept, major) {
    if (confirm(`确认删除专业：${dept} - ${major}？\n删除后该专业的所有数据将无法恢复。`)) {
        showSuccess(`已删除专业：${major}`);
        setTimeout(() => renderAdminDashboard(), 500);
    }
}

// ============ 新生档案同步功能 ============

// 同步学生数据
function syncStudentData() {
    showSuccess('正在从迎新系统同步数据...');
    setTimeout(() => {
        showSuccess('数据同步完成！共同步2,450条记录');
        renderAdminDashboard();
    }, 1500);
}

// ============ 基础配置同步功能 ============

// 同步配置数据
function syncConfigData() {
    showSuccess('正在从迎新系统同步配置...');
    setTimeout(() => {
        showSuccess('配置同步完成！已更新批次和专业信息');
        renderAdminDashboard();
    }, 1500);
}

// 树形结构展开/收起
function toggleDeptTree(code) {
    const content = document.getElementById(`tree-content-${code}`);
    const icon = document.getElementById(`tree-icon-${code}`);
    if (content && icon) {
        const isExpanded = content.style.display === 'block';
        content.style.display = isExpanded ? 'none' : 'block';
        icon.style.transform = isExpanded ? 'rotate(0deg)' : 'rotate(90deg)';
    }
}

// 全部展开/收起树形结构
let treeExpandedAll = false;
function toggleTreeExpand() {
    treeExpandedAll = !treeExpandedAll;
    const codes = ['CS', 'NUR', 'EC', 'ME', 'ARC'];
    codes.forEach(code => {
        const content = document.getElementById(`tree-content-${code}`);
        const icon = document.getElementById(`tree-icon-${code}`);
        if (content && icon) {
            content.style.display = treeExpandedAll ? 'block' : 'none';
            icon.style.transform = treeExpandedAll ? 'rotate(90deg)' : 'rotate(0deg)';
        }
    });
    showSuccess(treeExpandedAll ? '已全部展开' : '已全部收起');
}

// ============ 学号管理交互函数 ============

// 新增学号生成方案
function addStudentNoRule() {
    showModal(`
        <div style="padding:20px 24px;border-bottom:1px solid #E5EAF3;">
            <div style="font-size:16px;font-weight:600;color:#1F2D3D;">新增学号生成方案</div>
        </div>
        <div style="padding:24px;">
            <div style="margin-bottom:16px;">
                <label style="display:block;font-size:13px;color:#5B6B7A;margin-bottom:6px;">方案名称 <span style="color:#FF4D4F;">*</span></label>
                <input id="rule-name" style="width:100%;padding:8px 12px;border:1px solid #E5EAF3;border-radius:6px;font-size:13px;outline:none;" placeholder="如：2025年入学学号方案" />
            </div>
            <div style="background:#F0F9FF;border:1px solid #91CAFF;border-radius:6px;padding:12px;margin-bottom:16px;">
                <div style="font-size:12px;color:#1677FF;margin-bottom:8px;"><i class="fas fa-info-circle"></i> 学号规则说明</div>
                <div style="font-size:11px;color:#5B6B7A;line-height:1.6;">
                    • 常量型：固定值，如入学年份"2024"<br>
                    • 关联型：根据学生属性自动关联，如"{学院代码}"、"{专业代码}"<br>
                    • 排序型：按特定规则递增，如"{序号3位}"表示001、002、003...
                </div>
            </div>
        </div>
        <div style="padding:12px 24px;border-top:1px solid #E5EAF3;display:flex;gap:8px;justify-content:flex-end;">
            <button onclick="closeModal()" style="padding:7px 16px;background:white;color:#5B6B7A;border:1px solid #E5EAF3;border-radius:6px;font-size:13px;cursor:pointer;">取消</button>
            <button onclick="saveStudentNoRule()" style="padding:7px 16px;background:#1677FF;color:white;border:none;border-radius:6px;font-size:13px;cursor:pointer;">确认新增</button>
        </div>
    `);
}

function saveStudentNoRule() {
    const name = document.getElementById('rule-name')?.value;
    if (!name) {
        alert('请输入方案名称');
        return;
    }
    closeModal();
    showSuccess(`已新增学号生成方案：${name}`);
    setTimeout(() => switchAdminPage('studentno'), 500);
}

// 编辑学号生成方案
function editStudentNoRule(name) {
    showModal(`
        <div style="padding:20px 24px;border-bottom:1px solid #E5EAF3;">
            <div style="font-size:16px;font-weight:600;color:#1F2D3D;">编辑方案 - ${name}</div>
        </div>
        <div style="padding:24px;">
            <div style="margin-bottom:16px;">
                <label style="display:block;font-size:13px;color:#5B6B7A;margin-bottom:6px;">方案名称</label>
                <input style="width:100%;padding:8px 12px;border:1px solid #E5EAF3;border-radius:6px;font-size:13px;outline:none;" value="${name}" />
            </div>
        </div>
        <div style="padding:12px 24px;border-top:1px solid #E5EAF3;display:flex;gap:8px;justify-content:flex-end;">
            <button onclick="closeModal()" style="padding:7px 16px;background:white;color:#5B6B7A;border:1px solid #E5EAF3;border-radius:6px;font-size:13px;cursor:pointer;">取消</button>
            <button onclick="closeModal();showSuccess('方案已更新')" style="padding:7px 16px;background:#1677FF;color:white;border:none;border-radius:6px;font-size:13px;cursor:pointer;">保存</button>
        </div>
    `);
}

// 复制学号生成方案
function copyStudentNoRule(name) {
    showSuccess(`正在复制方案：${name}`);
    setTimeout(() => {
        showSuccess('方案复制成功！');
        switchAdminPage('studentno');
    }, 800);
}

// 删除学号生成方案
function deleteStudentNoRule(name) {
    if (confirm(`确认删除方案：${name}？\n删除后无法恢复。`)) {
        showSuccess(`已删除方案：${name}`);
        setTimeout(() => switchAdminPage('studentno'), 500);
    }
}

// 添加规则要素
function addRuleElement() {
    showModal(`
        <div style="padding:20px 24px;border-bottom:1px solid #E5EAF3;">
            <div style="font-size:16px;font-weight:600;color:#1F2D3D;">添加规则要素</div>
        </div>
        <div style="padding:24px;">
            <div style="margin-bottom:16px;">
                <label style="display:block;font-size:13px;color:#5B6B7A;margin-bottom:6px;">要素类型 <span style="color:#FF4D4F;">*</span></label>
                <select id="element-type" style="width:100%;padding:8px 12px;border:1px solid #E5EAF3;border-radius:6px;font-size:13px;outline:none;">
                    <option>常量型（固定值）</option>
                    <option>关联型（学院代码）</option>
                    <option>关联型（专业代码）</option>
                    <option>排序型（递增序号）</option>
                </select>
            </div>
            <div style="margin-bottom:16px;">
                <label style="display:block;font-size:13px;color:#5B6B7A;margin-bottom:6px;">要素值配置</label>
                <input id="element-value" style="width:100%;padding:8px 12px;border:1px solid #E5EAF3;border-radius:6px;font-size:13px;outline:none;" placeholder="如：2024 或 {学院代码} 或 {序号3位}" />
            </div>
        </div>
        <div style="padding:12px 24px;border-top:1px solid #E5EAF3;display:flex;gap:8px;justify-content:flex-end;">
            <button onclick="closeModal()" style="padding:7px 16px;background:white;color:#5B6B7A;border:1px solid #E5EAF3;border-radius:6px;font-size:13px;cursor:pointer;">取消</button>
            <button onclick="closeModal();showSuccess('规则要素已添加')" style="padding:7px 16px;background:#1677FF;color:white;border:none;border-radius:6px;font-size:13px;cursor:pointer;">添加</button>
        </div>
    `);
}

// 预览学号
function previewStudentNo() {
    showSuccess('正在生成预览...');
    setTimeout(() => {
        showModal(`
            <div style="padding:20px 24px;border-bottom:1px solid #E5EAF3;">
                <div style="font-size:16px;font-weight:600;color:#1F2D3D;">学号生成预览</div>
            </div>
            <div style="padding:24px;max-height:400px;overflow-y:auto;">
                <div style="background:#E6F4FF;border-radius:6px;padding:12px;margin-bottom:16px;">
                    <div style="font-size:12px;color:#1677FF;"><i class="fas fa-info-circle"></i> 基于当前规则预览前10位学生学号</div>
                </div>
                ${[
                    ['张小明', '计算机学院', '计算机应用技术', '202401001001'],
                    ['王建国', '护理学院', '护理', '202402001001'],
                    ['刘思宇', '电商学院', '电子商务', '202403001001'],
                    ['陈晓峰', '机电学院', '机电一体化', '202404001001'],
                    ['赵美丽', '护理学院', '助产', '202402002001'],
                    ['周文博', '计算机学院', '软件技术', '202401002001'],
                    ['吴志强', '电商学院', '市场营销', '202403002001'],
                    ['冯晓慧', '建筑学院', '建筑工程技术', '202405001001'],
                    ['褚鑫', '计算机学院', '大数据技术', '202401003001'],
                    ['郑文博', '机电学院', '数控技术', '202404002001']
                ].map(([name, dept, major, studentNo]) => `
                    <div style="display:flex;align-items:center;gap:12px;padding:10px;background:#F9FAFB;border-radius:6px;margin-bottom:8px;">
                        <div style="flex:1;">
                            <div style="font-size:13px;font-weight:500;color:#1F2D3D;">${name}</div>
                            <div style="font-size:11px;color:#9AACBA;">${dept} · ${major}</div>
                        </div>
                        <div style="font-family:monospace;font-size:14px;font-weight:600;color:#1677FF;">${studentNo}</div>
                    </div>
                `).join('')}
            </div>
            <div style="padding:12px 24px;border-top:1px solid #E5EAF3;text-align:right;">
                <button onclick="closeModal()" style="padding:7px 16px;background:#1677FF;color:white;border:none;border-radius:6px;font-size:13px;cursor:pointer;">关闭</button>
            </div>
        `);
    }, 500);
}

// 批量生成学号
function generateStudentNo() {
    if (confirm('确认批量生成学号？\n将为482位待生成学号的学生自动分配学号。')) {
        showSuccess('正在批量生成学号...');
        setTimeout(() => {
            showSuccess('学号生成完成！已为482位学生生成学号');
            switchAdminPage('studentno');
        }, 1500);
    }
}

// 修改单个学生学号
function editSingleStudentNo(examNo) {
    showModal(`
        <div style="padding:20px 24px;border-bottom:1px solid #E5EAF3;">
            <div style="font-size:16px;font-weight:600;color:#1F2D3D;">修改学号</div>
        </div>
        <div style="padding:24px;">
            <div style="background:#FFF7E6;border:1px solid #FFD591;border-radius:6px;padding:10px 12px;margin-bottom:16px;font-size:12px;color:#FA8C16;">
                <i class="fas fa-exclamation-triangle"></i> 修改学号后可能影响学号规则连续性，请谨慎操作
            </div>
            <div style="margin-bottom:16px;">
                <label style="display:block;font-size:13px;color:#5B6B7A;margin-bottom:6px;">考生号</label>
                <input style="width:100%;padding:8px 12px;border:1px solid #E5EAF3;border-radius:6px;font-size:13px;background:#F9FAFB;" value="${examNo}" disabled />
            </div>
            <div style="margin-bottom:16px;">
                <label style="display:block;font-size:13px;color:#5B6B7A;margin-bottom:6px;">新学号 <span style="color:#FF4D4F;">*</span></label>
                <input id="new-studentno" style="width:100%;padding:8px 12px;border:1px solid #E5EAF3;border-radius:6px;font-size:13px;outline:none;font-family:monospace;" placeholder="请输入新学号" value="202401001001" />
            </div>
        </div>
        <div style="padding:12px 24px;border-top:1px solid #E5EAF3;display:flex;gap:8px;justify-content:flex-end;">
            <button onclick="closeModal()" style="padding:7px 16px;background:white;color:#5B6B7A;border:1px solid #E5EAF3;border-radius:6px;font-size:13px;cursor:pointer;">取消</button>
            <button onclick="closeModal();showSuccess('学号已更新')" style="padding:7px 16px;background:#1677FF;color:white;border:none;border-radius:6px;font-size:13px;cursor:pointer;">保存</button>
        </div>
    `);
}

// ==================== 一卡通管理交互函数 ====================

// 录入一卡通信息
function inputCardInfo(studentNo, name) {
    showModal(`
        <div style="padding:20px 24px;border-bottom:1px solid #E5EAF3;">
            <div style="font-size:16px;font-weight:600;color:#1F2D3D;">录入一卡通信息</div>
        </div>
        <div style="padding:24px;">
            <div style="margin-bottom:16px;">
                <label style="display:block;font-size:13px;color:#5B6B7A;margin-bottom:6px;">学号</label>
                <input style="width:100%;padding:8px 12px;border:1px solid #E5EAF3;border-radius:6px;font-size:13px;background:#F9FAFB;" value="${studentNo}" disabled />
            </div>
            <div style="margin-bottom:16px;">
                <label style="display:block;font-size:13px;color:#5B6B7A;margin-bottom:6px;">姓名</label>
                <input style="width:100%;padding:8px 12px;border:1px solid #E5EAF3;border-radius:6px;font-size:13px;background:#F9FAFB;" value="${name}" disabled />
            </div>
            <div style="margin-bottom:16px;">
                <label style="display:block;font-size:13px;color:#5B6B7A;margin-bottom:6px;">一卡通号 <span style="color:#FF4D4F;">*</span></label>
                <input id="card-number" style="width:100%;padding:8px 12px;border:1px solid #E5EAF3;border-radius:6px;font-size:13px;outline:none;font-family:monospace;" placeholder="请输入一卡通号（8-12位）" />
            </div>
            <div style="margin-bottom:16px;">
                <label style="display:block;font-size:13px;color:#5B6B7A;margin-bottom:6px;">初始密码 <span style="color:#FF4D4F;">*</span></label>
                <input id="card-password" type="password" style="width:100%;padding:8px 12px;border:1px solid #E5EAF3;border-radius:6px;font-size:13px;outline:none;" placeholder="默认为身份证后6位" value="123456" />
            </div>
            <div style="background:#E6F4FF;border:1px solid #91CAFF;border-radius:6px;padding:10px 12px;font-size:12px;color:#1677FF;">
                <i class="fas fa-info-circle"></i> 一卡通号录入后将自动激活，学生可使用卡号+密码登录校园系统
            </div>
        </div>
        <div style="padding:12px 24px;border-top:1px solid #E5EAF3;display:flex;gap:8px;justify-content:flex-end;">
            <button onclick="closeModal()" style="padding:7px 16px;background:white;color:#5B6B7A;border:1px solid #E5EAF3;border-radius:6px;font-size:13px;cursor:pointer;">取消</button>
            <button onclick="saveCardInfo('${studentNo}')" style="padding:7px 16px;background:#1677FF;color:white;border:none;border-radius:6px;font-size:13px;cursor:pointer;">保存</button>
        </div>
    `);
}

// 保存一卡通信息
function saveCardInfo(studentNo) {
    const cardNumber = document.getElementById('card-number').value;
    if (!cardNumber) {
        alert('请输入一卡通号');
        return;
    }
    if (cardNumber.length < 8 || cardNumber.length > 12) {
        alert('一卡通号长度应为8-12位');
        return;
    }
    closeModal();
    showSuccess(`一卡通信息已录入：${cardNumber}`);
    setTimeout(() => switchAdminPage('card'), 500);
}

// 标记领取状态
function markCardReceived(studentNo, name) {
    showModal(`
        <div style="padding:20px 24px;border-bottom:1px solid #E5EAF3;">
            <div style="font-size:16px;font-weight:600;color:#1F2D3D;">确认领取</div>
        </div>
        <div style="padding:24px;">
            <div style="margin-bottom:16px;">
                <label style="display:block;font-size:13px;color:#5B6B7A;margin-bottom:6px;">学号</label>
                <input style="width:100%;padding:8px 12px;border:1px solid #E5EAF3;border-radius:6px;font-size:13px;background:#F9FAFB;" value="${studentNo}" disabled />
            </div>
            <div style="margin-bottom:16px;">
                <label style="display:block;font-size:13px;color:#5B6B7A;margin-bottom:6px;">姓名</label>
                <input style="width:100%;padding:8px 12px;border:1px solid #E5EAF3;border-radius:6px;font-size:13px;background:#F9FAFB;" value="${name}" disabled />
            </div>
            <div style="margin-bottom:16px;">
                <label style="display:block;font-size:13px;color:#5B6B7A;margin-bottom:6px;">领取人签名 <span style="color:#FF4D4F;">*</span></label>
                <input id="receiver-name" style="width:100%;padding:8px 12px;border:1px solid #E5EAF3;border-radius:6px;font-size:13px;outline:none;" placeholder="请输入领取人姓名" />
            </div>
            <div style="margin-bottom:16px;">
                <label style="display:block;font-size:13px;color:#5B6B7A;margin-bottom:6px;">领取时间</label>
                <input style="width:100%;padding:8px 12px;border:1px solid #E5EAF3;border-radius:6px;font-size:13px;background:#F9FAFB;" value="${new Date().toLocaleString('zh-CN')}" disabled />
            </div>
            <div style="background:#FFF7E6;border:1px solid #FFD591;border-radius:6px;padding:10px 12px;font-size:12px;color:#FA8C16;">
                <i class="fas fa-exclamation-triangle"></i> 请确认本人领取，领取后状态将标记为"已领取"
            </div>
        </div>
        <div style="padding:12px 24px;border-top:1px solid #E5EAF3;display:flex;gap:8px;justify-content:flex-end;">
            <button onclick="closeModal()" style="padding:7px 16px;background:white;color:#5B6B7A;border:1px solid #E5EAF3;border-radius:6px;font-size:13px;cursor:pointer;">取消</button>
            <button onclick="confirmCardReceived('${studentNo}')" style="padding:7px 16px;background:#52C41A;color:white;border:none;border-radius:6px;font-size:13px;cursor:pointer;">确认领取</button>
        </div>
    `);
}

// 确认领取
function confirmCardReceived(studentNo) {
    const receiverName = document.getElementById('receiver-name').value;
    if (!receiverName) {
        alert('请输入领取人姓名');
        return;
    }
    closeModal();
    showSuccess('一卡通已标记为已领取');
    setTimeout(() => switchAdminPage('card'), 500);
}

// 批量导出一卡通数据
function exportCardData() {
    showSuccess('正在导出一卡通数据...');
    setTimeout(() => {
        showSuccess('一卡通数据已导出：campus_card_2024.xlsx');
    }, 1500);
}

// ==================== 新生档案管理 - 树形结构辅助函数 ====================

// 生成院系树形结构
function generateDepartmentTree(campus, departments) {
    return departments.map(dept => `
        <div style="margin-bottom:6px;">
            <!-- 院系节点 -->
            <div onclick="toggleTreeNode('dept-${campus}-${dept.code}')" style="padding:6px 10px;border-radius:4px;cursor:pointer;background:white;border:1px solid #E5EAF3;margin-bottom:4px;">
                <div style="display:flex;align-items:center;">
                    <i id="icon-dept-${campus}-${dept.code}" class="fas fa-chevron-right" style="color:#5B6B7A;margin-right:6px;font-size:10px;"></i>
                    <i class="fas fa-graduation-cap" style="color:#1677FF;margin-right:6px;font-size:12px;"></i>
                    <span style="font-size:12px;font-weight:500;color:#1F2D3D;">${dept.name}</span>
                    <span style="margin-left:auto;font-size:11px;color:#5B6B7A;">${dept.count}</span>
                </div>
            </div>
            <!-- 专业列表 -->
            <div id="tree-dept-${campus}-${dept.code}" style="display:none;margin-left:16px;">
                ${dept.majors.map(major => `
                    <div style="margin-bottom:4px;">
                        <!-- 专业节点 -->
                        <div onclick="toggleTreeNode('major-${campus}-${dept.code}-${major.name.replace(/\s/g,'')}')" style="padding:5px 8px;border-radius:4px;cursor:pointer;background:#F9FAFB;margin-bottom:3px;">
                            <div style="display:flex;align-items:center;">
                                <i id="icon-major-${campus}-${dept.code}-${major.name.replace(/\s/g,'')}" class="fas fa-chevron-right" style="color:#5B6B7A;margin-right:6px;font-size:9px;"></i>
                                <i class="fas fa-book" style="color:#52C41A;margin-right:6px;font-size:11px;"></i>
                                <span style="font-size:11px;color:#1F2D3D;">${major.name}</span>
                                <span style="margin-left:auto;font-size:10px;color:#5B6B7A;">${major.count}</span>
                            </div>
                        </div>
                        <!-- 班级列表 -->
                        <div id="tree-major-${campus}-${dept.code}-${major.name.replace(/\s/g,'')}" style="display:none;margin-left:12px;">
                            ${major.classes.map(cls => `
                                <div onclick="selectTreeNode('class','${cls}')" style="padding:4px 8px;border-radius:3px;cursor:pointer;background:white;margin-bottom:2px;border:1px solid #F0F2F5;">
                                    <div style="display:flex;align-items:center;">
                                        <i class="fas fa-users" style="color:#FA8C16;margin-right:6px;font-size:10px;"></i>
                                        <span style="font-size:11px;color:#5B6B7A;">${cls}</span>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `).join('');
}

// ============ 分班管理：院系组织树 + 学年人数 + 按院系分班 ============
const CLASS_DATA = {
    year: '2024',
    campuses: [
        { code:'south', name:'南校区', depts:[
            { code:'cs', name:'计算机学院', majors:[
                { name:'计算机应用技术', classes:[ {name:'计算机2401班',male:28,female:17}, {name:'计算机2402班',male:26,female:17}, {name:'计算机2403班',male:27,female:17}, {name:'计算机2404班',male:29,female:16} ] },
                { name:'软件技术', classes:[ {name:'软件2401班',male:24,female:16}, {name:'软件2402班',male:22,female:16} ] },
                { name:'人工智能技术', classes:[ {name:'AI2401班',male:38,female:22} ] }
            ]},
            { code:'nu', name:'护理学院', majors:[
                { name:'护理', classes:[ {name:'护理2401班',male:6,female:36}, {name:'护理2402班',male:5,female:36}, {name:'护理2403班',male:6,female:34} ] },
                { name:'助产', classes:[ {name:'助产2401班',male:2,female:43}, {name:'助产2402班',male:1,female:41} ] }
            ]},
            { code:'ec', name:'电商学院', majors:[
                { name:'电子商务', classes:[ {name:'电商2401班',male:20,female:24}, {name:'电商2402班',male:19,female:23} ] },
                { name:'网络营销', classes:[ {name:'营销2401班',male:18,female:24} ] }
            ]}
        ]},
        { code:'north', name:'北校区', depts:[
            { code:'me', name:'机电学院', majors:[
                { name:'机电一体化', classes:[ {name:'机电2401班',male:36,female:4}, {name:'机电2402班',male:34,female:4} ] },
                { name:'电气自动化', classes:[ {name:'电气2401班',male:38,female:4} ] }
            ]},
            { code:'ar', name:'建筑学院', majors:[
                { name:'建筑工程技术', classes:[ {name:'建工2401班',male:40,female:5}, {name:'建工2402班',male:38,female:5} ] },
                { name:'工程造价', classes:[ {name:'造价2401班',male:24,female:20}, {name:'造价2402班',male:22,female:18} ] }
            ]}
        ]}
    ]
};
const UNASSIGNED_CLASS = [
    {id:'202401046',name:'孙志远',sex:'男',dep:'cs',major:'计算机应用技术',reason:'数据缺失'},
    {id:'202401047',name:'周海燕',sex:'女',dep:'cs',major:'计算机应用技术',reason:'未报到'},
    {id:'202401048',name:'吴志强',sex:'男',dep:'cs',major:'计算机应用技术',reason:'信息不全'}
];
let CURRENT_CLASS_SCOPE = 'all';

function classCount(c){ return c.male + c.female; }
function majorTotal(m){ return m.classes.reduce((s,c)=>s+classCount(c),0); }
function majorMale(m){ return m.classes.reduce((s,c)=>s+c.male,0); }
function majorFemale(m){ return m.classes.reduce((s,c)=>s+c.female,0); }
function deptTotal(d){ return d.majors.reduce((s,m)=>s+majorTotal(m),0); }
function deptMale(d){ return d.majors.reduce((s,m)=>s+majorMale(m),0); }
function deptFemale(d){ return d.majors.reduce((s,m)=>s+majorFemale(m),0); }
function deptClasses(d){ return d.majors.reduce((s,m)=>s+m.classes.length,0); }
function campusTotal(cp){ return cp.depts.reduce((s,d)=>s+deptTotal(d),0); }
function schoolTotal(){ return CLASS_DATA.campuses.reduce((s,cp)=>s+campusTotal(cp),0); }

// 生成分班院系组织树
function genClassTree() {
    const total = schoolTotal();
    let html = `
      <div data-scopenode onclick="selectClassScope('all', event)" style="padding:8px 12px;border-radius:6px;cursor:pointer;margin-bottom:8px;background:#FAFBFF;outline:2px solid #1677FF;outline-offset:-2px;">
        <div style="display:flex;align-items:center;">
          <i class="fas fa-school" style="color:#1677FF;margin-right:8px;"></i>
          <span style="font-size:13px;font-weight:600;color:#1677FF;">全校</span>
          <span style="margin-left:auto;font-size:12px;color:#1677FF;">${total.toLocaleString()}</span>
        </div>
      </div>`;
    CLASS_DATA.campuses.forEach(cp => {
        html += `
          <div style="margin-top:8px;">
            <div onclick="toggleTreeNode('cls-cp-${cp.code}')" style="padding:8px 12px;border-radius:6px;cursor:pointer;background:#F9FAFB;margin-bottom:4px;">
              <div style="display:flex;align-items:center;">
                <i id="icon-cls-cp-${cp.code}" class="fas fa-chevron-down" style="color:#5B6B7A;margin-right:8px;font-size:11px;"></i>
                <i class="fas fa-building" style="color:#1677FF;margin-right:8px;"></i>
                <span style="font-size:13px;font-weight:600;color:#1F2D3D;">${cp.name}</span>
                <span style="margin-left:auto;font-size:12px;color:#5B6B7A;">${campusTotal(cp)}</span>
              </div>
            </div>
            <div id="tree-cls-cp-${cp.code}" style="margin-left:16px;">`;
        cp.depts.forEach(dep => {
            html += `
              <div style="margin-bottom:6px;">
                <div style="display:flex;align-items:center;background:white;border:1px solid #E5EAF3;border-radius:4px;margin-bottom:4px;">
                  <i onclick="toggleTreeNode('cls-dep-${cp.code}-${dep.code}')" id="icon-cls-dep-${cp.code}-${dep.code}" class="fas fa-chevron-right" style="color:#5B6B7A;padding:7px 4px 7px 10px;font-size:10px;cursor:pointer;"></i>
                  <div data-scopenode onclick="selectClassScope('dept:${cp.code}:${dep.code}', event)" style="flex:1;padding:6px 0;cursor:pointer;display:flex;align-items:center;">
                    <i class="fas fa-graduation-cap" style="color:#1677FF;margin-right:6px;font-size:12px;"></i>
                    <span style="font-size:12px;font-weight:500;color:#1F2D3D;">${dep.name}</span>
                    <span style="margin-left:auto;font-size:11px;color:#5B6B7A;padding-right:10px;">${deptTotal(dep)}</span>
                  </div>
                </div>
                <div id="tree-cls-dep-${cp.code}-${dep.code}" style="display:none;margin-left:16px;">`;
            dep.majors.forEach((mj, mi) => {
                html += `
                  <div data-scopenode onclick="selectClassScope('major:${cp.code}:${dep.code}:${mi}', event)" style="padding:5px 8px;border-radius:4px;cursor:pointer;background:#F9FAFB;margin-bottom:3px;display:flex;align-items:center;">
                    <i class="fas fa-book" style="color:#52C41A;margin-right:6px;font-size:11px;"></i>
                    <span style="font-size:11px;color:#1F2D3D;">${mj.name}</span>
                    <span style="margin-left:auto;font-size:10px;color:#5B6B7A;">${majorTotal(mj)}</span>
                  </div>`;
            });
            html += `</div></div>`;
        });
        html += `</div></div>`;
    });
    return html;
}

function resolveScope(key){
    const p = key.split(':');
    if(p[0]==='all'){
        const depts=[]; CLASS_DATA.campuses.forEach(cp=>cp.depts.forEach(d=>depts.push({cp,dep:d})));
        return {level:'all', crumb:`${CLASS_DATA.year} 学年 · 全校`, depts};
    }
    if(p[0]==='campus'){
        const cp=CLASS_DATA.campuses.find(c=>c.code===p[1]);
        return {level:'campus', crumb:`${CLASS_DATA.year} 学年 · ${cp.name}`, depts:cp.depts.map(d=>({cp,dep:d}))};
    }
    const cp=CLASS_DATA.campuses.find(c=>c.code===p[1]);
    const dep=cp.depts.find(d=>d.code===p[2]);
    if(p[0]==='dept') return {level:'dept', crumb:`${CLASS_DATA.year} 学年 · ${cp.name} · ${dep.name}`, cp, dep};
    const mj=dep.majors[+p[3]];
    return {level:'major', crumb:`${CLASS_DATA.year} 学年 · ${cp.name} · ${dep.name} · ${mj.name}`, cp, dep, mj};
}

function clsStatCards(cards){
    return `<div style="display:grid;grid-template-columns:repeat(${cards.length},1fr);gap:12px;margin-bottom:16px;">`+
        cards.map(c=>`<div style="background:white;border:1px solid #E5EAF3;border-radius:8px;padding:14px;">
            <div style="font-size:12px;color:#5B6B7A;margin-bottom:4px;">${c.label}</div>
            <div style="font-size:24px;font-weight:600;color:${c.color};">${c.value}</div></div>`).join('')+`</div>`;
}
function clsScopeHeader(s){
    const tag = s.level==='all'?'全校汇总':s.level==='campus'?'校区汇总':s.level==='dept'?'院系分班':'专业分班';
    return `<div style="${AS.card}display:flex;align-items:center;justify-content:space-between;padding:14px 18px;">
        <div><div style="font-size:13px;color:#9AACBA;margin-bottom:2px;"><i class="fas fa-location-dot" style="margin-right:4px;"></i>当前范围</div>
        <div style="font-size:16px;font-weight:600;color:#1F2D3D;">${s.crumb}</div></div>
        <span style="${AS.badge('#1677FF','#E6F4FF')}">${tag}</span></div>`;
}
function clsRuleConfig(){
    return `<div style="${AS.card}">
        <div style="${AS.cardTitle}"><i class="fas fa-sliders-h" style="color:#1677FF;"></i>分班规则配置</div>
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:14px;">
            <div><label style="font-size:12px;color:#5B6B7A;margin-bottom:4px;display:block;">分班依据</label>
                <select style="${AS.input}width:100%;"><option>按专业分班</option><option>按成绩分班</option><option>按性别比例分班</option></select></div>
            <div><label style="font-size:12px;color:#5B6B7A;margin-bottom:4px;display:block;">每班人数</label>
                <input style="${AS.input}width:100%;" value="45" /></div>
            <div><label style="font-size:12px;color:#5B6B7A;margin-bottom:4px;display:block;">性别比例</label>
                <select style="${AS.input}width:100%;"><option>不限制</option><option>尽量平衡</option><option>按男女分班</option></select></div>
        </div>
        <button style="${AS.btnPrimary}"><i class="fas fa-play"></i> 执行自动分班</button>
    </div>`;
}
function clsCards(classes){
    return `<div style="display:grid;grid-template-columns:repeat(2,1fr);gap:12px;">`+
        classes.map(c=>`<div style="border:1px solid #E5EAF3;border-radius:8px;padding:14px;background:white;">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">
                <span style="font-size:14px;font-weight:600;color:#1F2D3D;">${c.name}</span>
                <span style="${AS.badge('#1677FF','#E6F4FF')}">${c.male+c.female}人</span></div>
            ${c.major?`<div style="font-size:11px;color:#9AACBA;margin-bottom:8px;">${c.major}</div>`:''}
            <div style="display:flex;gap:8px;margin-bottom:10px;">
                <span style="${AS.badge('#52C41A','#F6FFED')}">男 ${c.male}</span>
                <span style="${AS.badge('#EB2F96','#FFF0F6')}">女 ${c.female}</span></div>
            <div style="display:flex;gap:6px;">
                <button onclick="viewClassRoster('${c.name}','${c.major||''}',${c.male},${c.female})" style="padding:4px 10px;font-size:11px;background:white;color:#1677FF;border:1px solid #1677FF;border-radius:4px;cursor:pointer;">查看名单</button>
                <button onclick="showSuccess('演示：${c.name} 进入手动调整')" style="padding:4px 10px;font-size:11px;background:white;color:#5B6B7A;border:1px solid #E5EAF3;border-radius:4px;cursor:pointer;">调整</button></div>
        </div>`).join('')+`</div>`;
}
// 分班结果预览（列表形式）
function clsList(classes){
    return `<div style="border:1px solid #E5EAF3;border-radius:6px;overflow:hidden;">
        <table style="width:100%;border-collapse:collapse;font-size:13px;">
            <thead><tr style="background:#F9FAFB;">
                ${['班级','专业','总人数','男生','女生','操作'].map(h=>`<th style="padding:10px 16px;text-align:left;color:#5B6B7A;font-weight:500;border-bottom:1px solid #E5EAF3;white-space:nowrap;">${h}</th>`).join('')}
            </tr></thead>
            <tbody>
            ${classes.map(c=>`<tr style="border-bottom:1px solid #F0F2F5;">
                <td style="padding:10px 16px;font-weight:600;color:#1F2D3D;white-space:nowrap;">${c.name}</td>
                <td style="padding:10px 16px;color:#5B6B7A;white-space:nowrap;">${c.major||'—'}</td>
                <td style="padding:10px 16px;"><span style="${AS.badge('#1677FF','#E6F4FF')}">${c.male+c.female}人</span></td>
                <td style="padding:10px 16px;color:#1677FF;">男 ${c.male}</td>
                <td style="padding:10px 16px;color:#EB2F96;">女 ${c.female}</td>
                <td style="padding:10px 16px;white-space:nowrap;">
                    <button onclick="viewClassRoster('${c.name}','${c.major||''}',${c.male},${c.female})" style="padding:3px 10px;font-size:11px;background:white;color:#1677FF;border:1px solid #1677FF;border-radius:4px;cursor:pointer;margin-right:6px;">查看名单</button>
                    <button onclick="showSuccess('演示：${c.name} 进入手动调整')" style="padding:3px 10px;font-size:11px;background:white;color:#5B6B7A;border:1px solid #E5EAF3;border-radius:4px;cursor:pointer;">调整</button>
                </td>
            </tr>`).join('')}
            </tbody>
        </table>
    </div>`;
}
// 查看班级名单
function viewClassRoster(cls, major, male, female){
    const surnames='王李张刘陈杨赵黄周吴徐孙马朱胡郭何高林郑谢罗梁宋唐许韩冯邓曹彭曾肖田董袁潘蒋蔡';
    const mGiven=['浩然','子轩','宇航','俊杰','梓豪','志强','文博','晓峰','建国','嘉豪','鑫磊','天宇','明轩','凯文','睿'];
    const fGiven=['欣怡','梓涵','雨萱','思雅','晓燕','佳怡','梦琪','雅婷','心怡','子萱','美琳','婧怡','可昕','诗涵','悦'];
    const seq=cls.replace(/\D/g,'')||'2401';
    let rows=[], n=0;
    function add(gender, given, count){
        for(let i=0;i<count;i++){
            n++;
            const name=surnames[(n*7)%surnames.length]+given[(n*3)%given.length];
            const id='2024'+seq+String(n).padStart(2,'0');
            rows.push({no:n,id,name,gender,major});
        }
    }
    add('男',mGiven,male); add('女',fGiven,female);
    showModal(`
        <div style="padding:20px 24px;border-bottom:1px solid #E5EAF3;display:flex;align-items:center;justify-content:space-between;">
            <div>
                <div style="font-size:16px;font-weight:600;color:#1F2D3D;">${cls} · 学生名单</div>
                <div id="rosterCount" data-major="${major}" style="font-size:12px;color:#5B6B7A;margin-top:4px;">${major} · 共 ${male+female} 人（男 ${male} / 女 ${female}）</div>
            </div>
            <button onclick="closeModal()" style="background:none;border:none;font-size:18px;color:#9AACBA;cursor:pointer;">&times;</button>
        </div>
        <div style="padding:0;max-height:460px;overflow-y:auto;">
            <table style="width:100%;border-collapse:collapse;font-size:13px;">
                <thead style="position:sticky;top:0;background:#F9FAFB;z-index:1;">
                    <tr>${['序号','学号','姓名','性别','专业','操作'].map(h=>`<th style="padding:10px 16px;text-align:left;color:#5B6B7A;font-weight:500;border-bottom:1px solid #E5EAF3;">${h}</th>`).join('')}</tr>
                </thead>
                <tbody>
                ${rows.map(r=>`<tr data-gender="${r.gender}" style="border-bottom:1px solid #F0F2F5;">
                    <td style="padding:9px 16px;color:#5B6B7A;">${r.no}</td>
                    <td style="padding:9px 16px;color:#5B6B7A;font-family:monospace;">${r.id}</td>
                    <td style="padding:9px 16px;font-weight:500;color:#1F2D3D;">${r.name}</td>
                    <td style="padding:9px 16px;">${r.gender==='男'?'<span style="color:#1677FF;"><i class="fas fa-mars"></i> 男</span>':'<span style="color:#EB2F96;"><i class="fas fa-venus"></i> 女</span>'}</td>
                    <td style="padding:9px 16px;color:#5B6B7A;">${r.major}</td>
                    <td style="padding:9px 16px;"><button onclick="removeRosterStudent(this,'${r.name}')" style="padding:3px 10px;font-size:11px;background:white;color:#FF4D4F;border:1px solid #FFA39E;border-radius:4px;cursor:pointer;">移除</button></td>
                </tr>`).join('')}
                </tbody>
            </table>
        </div>
        <div style="padding:12px 24px;border-top:1px solid #E5EAF3;display:flex;justify-content:flex-end;gap:8px;">
            <button onclick="closeModal()" style="${AS.btnDefault}">关闭</button>
            <button onclick="showSuccess('演示：已导出 ${cls} 名单')" style="${AS.btnPrimary}"><i class="fas fa-file-excel"></i> 导出名单</button>
        </div>
    `);
}
// 从班级名单移除学生（演示）
function removeRosterStudent(btn, name){
    const tr = btn.closest('tr');
    const tbody = tr.parentElement;
    tr.remove();
    const rows = [...tbody.querySelectorAll('tr')];
    if(!rows.length){ tbody.innerHTML = `<tr><td colspan="6" style="padding:20px;text-align:center;color:#9AACBA;">本班级暂无学生</td></tr>`; }
    else { rows.forEach((r,i)=>{ r.firstElementChild.textContent = i+1; }); }
    const male = rows.filter(r=>r.getAttribute('data-gender')==='男').length;
    const female = rows.length - male;
    const cnt = document.getElementById('rosterCount');
    if(cnt){ const major = cnt.getAttribute('data-major')||''; cnt.textContent = `${major} · 共 ${rows.length} 人（男 ${male} / 女 ${female}）`; }
    if(typeof showSuccess==='function') showSuccess('已将 '+name+' 移出本班级（演示）');
}
function clsDeptSummary(s){
    return `<div style="${AS.card}">
        <div style="${AS.cardTitle}"><i class="fas fa-list" style="color:#1677FF;"></i>院系学年人数明细</div>
        <div style="border:1px solid #E5EAF3;border-radius:6px;overflow:hidden;"><table style="width:100%;border-collapse:collapse;font-size:13px;">
            <tr style="background:#F9FAFB;">${['校区','院系','总人数','男','女','班级数','操作'].map(h=>`<th style="padding:10px 14px;text-align:left;color:#5B6B7A;font-weight:500;border-bottom:1px solid #E5EAF3;">${h}</th>`).join('')}</tr>
            ${s.depts.map(({cp,dep})=>`<tr style="border-bottom:1px solid #F0F2F5;">
                <td style="padding:10px 14px;color:#5B6B7A;">${cp.name}</td>
                <td style="padding:10px 14px;font-weight:500;color:#1F2D3D;">${dep.name}</td>
                <td style="padding:10px 14px;color:#1F2D3D;font-weight:600;">${deptTotal(dep)}</td>
                <td style="padding:10px 14px;color:#1677FF;">${deptMale(dep)}</td>
                <td style="padding:10px 14px;color:#EB2F96;">${deptFemale(dep)}</td>
                <td style="padding:10px 14px;color:#5B6B7A;">${deptClasses(dep)}</td>
                <td style="padding:10px 14px;"><button onclick="selectClassScope('dept:${cp.code}:${dep.code}')" style="padding:3px 10px;font-size:11px;background:#1677FF;color:white;border:none;border-radius:4px;cursor:pointer;">查看并分班</button></td>
            </tr>`).join('')}
        </table></div></div>`;
}
function clsUnassigned(s){
    let list = UNASSIGNED_CLASS;
    if(s.level==='dept') list=UNASSIGNED_CLASS.filter(u=>u.dep===s.dep.code);
    else if(s.level==='major') list=UNASSIGNED_CLASS.filter(u=>u.dep===s.dep.code && u.major===s.mj.name);
    else if(s.level==='campus'){ const codes=s.depts.map(x=>x.dep.code); list=UNASSIGNED_CLASS.filter(u=>codes.includes(u.dep)); }
    return `<div style="${AS.card}">
        <div style="${AS.cardTitle}"><i class="fas fa-exclamation-triangle" style="color:#FA8C16;"></i>未分配学生 <span style="${AS.badge('#FA8C16','#FFF7E6')}">${list.length}人</span></div>
        ${list.length?`<div style="border:1px solid #E5EAF3;border-radius:6px;overflow:hidden;"><table style="width:100%;border-collapse:collapse;font-size:13px;">
            <tr style="background:#F9FAFB;">${['学号','姓名','性别','专业','原因','操作'].map(h=>`<th style="padding:10px 14px;text-align:left;color:#5B6B7A;font-weight:500;border-bottom:1px solid #E5EAF3;">${h}</th>`).join('')}</tr>
            ${list.map(u=>`<tr style="border-bottom:1px solid #F0F2F5;">
                <td style="padding:10px 14px;color:#5B6B7A;">${u.id}</td>
                <td style="padding:10px 14px;font-weight:500;">${u.name}</td>
                <td style="padding:10px 14px;color:#5B6B7A;">${u.sex}</td>
                <td style="padding:10px 14px;color:#5B6B7A;">${u.major}</td>
                <td style="padding:10px 14px;"><span style="${AS.badge('#FA8C16','#FFF7E6')}">${u.reason}</span></td>
                <td style="padding:10px 14px;"><button style="padding:3px 10px;font-size:11px;background:#1677FF;color:white;border:none;border-radius:4px;cursor:pointer;">手动分配</button></td>
            </tr>`).join('')}
        </table></div>`:`<div style="padding:16px;text-align:center;color:#9AACBA;font-size:13px;">该范围暂无未分配学生</div>`}
    </div>`;
}
function renderClassScope(key){
    const s = resolveScope(key);
    if(s.level==='all' || s.level==='campus'){
        const total=s.depts.reduce((a,{dep})=>a+deptTotal(dep),0);
        const male=s.depts.reduce((a,{dep})=>a+deptMale(dep),0);
        const female=s.depts.reduce((a,{dep})=>a+deptFemale(dep),0);
        const classes=s.depts.reduce((a,{dep})=>a+deptClasses(dep),0);
        return clsScopeHeader(s)
            + clsStatCards([
                {label:'总人数',value:total.toLocaleString(),color:'#1F2D3D'},
                {label:'男生',value:male.toLocaleString(),color:'#1677FF'},
                {label:'女生',value:female.toLocaleString(),color:'#EB2F96'},
                {label:'班级数',value:classes,color:'#52C41A'}
            ])
            + clsDeptSummary(s)
            + `<div style="background:#FFF7E6;border:1px solid #FFE7BA;border-radius:8px;padding:12px 16px;font-size:12px;color:#AD6800;"><i class="fas fa-info-circle"></i> 请在左侧组织树或上表中选择具体院系 / 专业，进行分班规则配置与自动分班。</div>`;
    }
    let classes=[];
    if(s.level==='dept') s.dep.majors.forEach(m=>m.classes.forEach(c=>classes.push(Object.assign({major:m.name},c))));
    else s.mj.classes.forEach(c=>classes.push(Object.assign({major:s.mj.name},c)));
    const total=classes.reduce((a,c)=>a+c.male+c.female,0);
    const male=classes.reduce((a,c)=>a+c.male,0);
    const female=classes.reduce((a,c)=>a+c.female,0);
    return clsScopeHeader(s)
        + clsStatCards([
            {label:'总人数',value:total,color:'#1F2D3D'},
            {label:'男生',value:male,color:'#1677FF'},
            {label:'女生',value:female,color:'#EB2F96'},
            {label:'班级数',value:classes.length,color:'#52C41A'}
        ])
        + clsRuleConfig()
        + clsUnassigned(s)
        + `<div style="${AS.card}"><div style="${AS.cardTitle}"><i class="fas fa-users" style="color:#1677FF;"></i>分班结果预览</div>${clsList(classes)}</div>`;
}
function selectClassScope(key, ev){
    CURRENT_CLASS_SCOPE = key;
    document.querySelectorAll('[data-scopenode]').forEach(n=>{ n.style.outline=''; });
    if(ev && ev.currentTarget){ ev.currentTarget.style.outline='2px solid #1677FF'; ev.currentTarget.style.outlineOffset='-2px'; }
    const box=document.getElementById('classScopeContent');
    if(box) box.innerHTML=renderClassScope(key);
}
function changeClassYear(val){
    if(typeof showSuccess==='function') showSuccess('已切换至 '+val+'（演示数据相同）');
}

// 生成学生列表行
function generateStudentRows() {
    const students = [
        { no:1, name:'张小明', gender:'男', idcard:'130121200301151234', examNo:'130621202410001', type:'单招', dept:'计算机学院', major:'计算机应用技术', class:'计算机2401班', dorm:'1号楼-301-1' },
        { no:2, name:'李晓红', gender:'女', idcard:'130121200302251235', examNo:'130621202410002', type:'单招', dept:'护理学院', major:'护理', class:'护理2401班', dorm:'2号楼-201-2' },
        { no:3, name:'王建国', gender:'男', idcard:'130121200303151236', examNo:'130621202410003', type:'3+2', dept:'机电学院', major:'机电一体化', class:'机电2401班', dorm:'3号楼-402-3' },
        { no:4, name:'赵美丽', gender:'女', idcard:'130121200304251237', examNo:'130621202410004', type:'普通高考', dept:'电商学院', major:'电子商务', class:'电商2401班', dorm:'2号楼-305-4' },
        { no:5, name:'刘思宇', gender:'女', idcard:'130121200305151238', examNo:'130621202410005', type:'单招', dept:'护理学院', major:'助产', class:'助产2401班', dorm:'2号楼-402-1' },
        { no:6, name:'陈晓峰', gender:'男', idcard:'130121200306251239', examNo:'130621202410006', type:'单招', dept:'计算机学院', major:'软件技术', class:'软件2401班', dorm:'1号楼-205-2' },
        { no:7, name:'杨柳青', gender:'女', idcard:'130121200307151240', examNo:'130621202410007', type:'3+2', dept:'建筑学院', major:'建筑工程技术', class:'建工2401班', dorm:'2号楼-503-3' },
        { no:8, name:'周大伟', gender:'男', idcard:'130121200308251241', examNo:'130621202410008', type:'普通高考', dept:'机电学院', major:'电气自动化', class:'电气2401班', dorm:'3号楼-301-4' },
        { no:9, name:'吴小燕', gender:'女', idcard:'130121200309151242', examNo:'130621202410009', type:'单招', dept:'电商学院', major:'网络营销', class:'营销2401班', dorm:'2号楼-104-1' },
        { no:10, name:'郑强', gender:'男', idcard:'130121200310251243', examNo:'130621202410010', type:'单招', dept:'计算机学院', major:'人工智能技术', class:'AI2401班', dorm:'1号楼-403-2' }
    ];
    
    return students.map(s => `
        <tr style="border-bottom:1px solid #F0F2F5;transition:background 0.2s;" onmouseover="this.style.background='#FAFBFF'" onmouseout="this.style.background='white'">
            <td style="padding:10px 16px;color:#5B6B7A;font-size:12px;text-align:center;">${s.no}</td>
            <td style="padding:10px 16px;font-weight:500;color:#1F2D3D;white-space:nowrap;">${s.name}</td>
            <td style="padding:10px 16px;color:#5B6B7A;font-size:12px;text-align:center;">
                ${s.gender === '男' 
                    ? '<span style="color:#1677FF;"><i class="fas fa-mars"></i> 男</span>' 
                    : '<span style="color:#FA8C16;"><i class="fas fa-venus"></i> 女</span>'}
            </td>
            <td style="padding:10px 16px;color:#5B6B7A;font-size:12px;font-family:monospace;">${s.idcard}</td>
            <td style="padding:10px 16px;color:#5B6B7A;font-size:12px;font-family:monospace;">${s.examNo}</td>
            <td style="padding:10px 16px;">
                <span style="${AS.badge(
                    s.type==='单招'?'#1677FF':s.type==='3+2'?'#52C41A':'#FA8C16',
                    s.type==='单招'?'#E6F4FF':s.type==='3+2'?'#F6FFED':'#FFF7E6'
                )}">${s.type}</span>
            </td>
            <td style="padding:10px 16px;color:#5B6B7A;font-size:12px;white-space:nowrap;">${s.dept}</td>
            <td style="padding:10px 16px;color:#1F2D3D;font-size:12px;white-space:nowrap;">${s.major}</td>
            <td style="padding:10px 16px;color:#1F2D3D;font-size:12px;white-space:nowrap;">${s.class}</td>
            <td style="padding:10px 16px;color:#5B6B7A;font-size:12px;white-space:nowrap;">${s.dorm}</td>
            <td style="padding:10px 16px;white-space:nowrap;">
                <button onclick="viewStudentDetail('${s.examNo}')" style="padding:4px 10px;background:white;color:#1677FF;border:1px solid #1677FF;border-radius:4px;font-size:12px;cursor:pointer;">详情</button>
            </td>
        </tr>
    `).join('');
}

// 切换树形节点展开/收起
function toggleTreeNode(nodeId) {
    const treeNode = document.getElementById(`tree-${nodeId}`);
    const icon = document.getElementById(`icon-${nodeId}`);
    
    if (treeNode) {
        if (treeNode.style.display === 'none' || !treeNode.style.display) {
            treeNode.style.display = 'block';
            if (icon) icon.className = 'fas fa-chevron-down';
        } else {
            treeNode.style.display = 'none';
            if (icon) icon.className = 'fas fa-chevron-right';
        }
    }
}

// 选择树形节点（筛选学生）
function selectTreeNode(type, value) {
    // 清除所有节点的选中状态
    document.querySelectorAll('[onclick^="selectTreeNode"]').forEach(el => {
        el.style.background = el.style.background.includes('#E6F4FF') ? '' : el.style.background;
        el.style.border = el.style.border.includes('#91CAFF') ? '1px solid #E5EAF3' : el.style.border;
    });
    
    // 设置当前节点为选中状态
    event.target.closest('div').style.background = '#E6F4FF';
    event.target.closest('div').style.border = '1px solid #91CAFF';
    
    if (type === 'all') {
        showSuccess('已选择：全部学生（2,450人）');
    } else if (type === 'class') {
        showSuccess(`已选择：${value}`);
    }
}

// 查看学生详情
function viewStudentDetail(examNo) {
    showModal(`
        <div style="padding:20px 24px;border-bottom:1px solid #E5EAF3;">
            <div style="font-size:16px;font-weight:600;color:#1F2D3D;">学生档案详情</div>
            <div style="font-size:12px;color:#5B6B7A;margin-top:4px;">考生号：${examNo}</div>
        </div>
        <div style="padding:24px;max-height:500px;overflow-y:auto;">
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
                <div>
                    <label style="display:block;font-size:12px;color:#5B6B7A;margin-bottom:4px;">姓名</label>
                    <div style="font-size:14px;color:#1F2D3D;font-weight:500;">张小明</div>
                </div>
                <div>
                    <label style="display:block;font-size:12px;color:#5B6B7A;margin-bottom:4px;">性别</label>
                    <div style="font-size:14px;color:#1F2D3D;">男</div>
                </div>
                <div>
                    <label style="display:block;font-size:12px;color:#5B6B7A;margin-bottom:4px;">身份证号</label>
                    <div style="font-size:14px;color:#1F2D3D;font-family:monospace;">130121200301151234</div>
                </div>
                <div>
                    <label style="display:block;font-size:12px;color:#5B6B7A;margin-bottom:4px;">考生号</label>
                    <div style="font-size:14px;color:#1F2D3D;font-family:monospace;">${examNo}</div>
                </div>
                <div>
                    <label style="display:block;font-size:12px;color:#5B6B7A;margin-bottom:4px;">招生类型</label>
                    <div><span style="${AS.badge('#1677FF','#E6F4FF')}">单招</span></div>
                </div>
                <div>
                    <label style="display:block;font-size:12px;color:#5B6B7A;margin-bottom:4px;">录取院系</label>
                    <div style="font-size:14px;color:#1F2D3D;">计算机学院</div>
                </div>
                <div>
                    <label style="display:block;font-size:12px;color:#5B6B7A;margin-bottom:4px;">录取专业</label>
                    <div style="font-size:14px;color:#1F2D3D;">计算机应用技术</div>
                </div>
                <div>
                    <label style="display:block;font-size:12px;color:#5B6B7A;margin-bottom:4px;">班级</label>
                    <div style="font-size:14px;color:#1F2D3D;">计算机2401班</div>
                </div>
                <div>
                    <label style="display:block;font-size:12px;color:#5B6B7A;margin-bottom:4px;">宿舍号</label>
                    <div style="font-size:14px;color:#1F2D3D;">1号楼-301-1</div>
                </div>
                <div>
                    <label style="display:block;font-size:12px;color:#5B6B7A;margin-bottom:4px;">联系电话</label>
                    <div style="font-size:14px;color:#1F2D3D;">13812345678</div>
                </div>
            </div>
            <div style="margin-top:20px;padding-top:20px;border-top:1px solid #E5EAF3;">
                <div style="font-size:13px;font-weight:600;color:#1F2D3D;margin-bottom:12px;">家庭信息</div>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
                    <div>
                        <label style="display:block;font-size:12px;color:#5B6B7A;margin-bottom:4px;">家庭住址</label>
                        <div style="font-size:13px;color:#1F2D3D;">河北省保定市莲池区五四路88号</div>
                    </div>
                    <div>
                        <label style="display:block;font-size:12px;color:#5B6B7A;margin-bottom:4px;">家长姓名</label>
                        <div style="font-size:13px;color:#1F2D3D;">张大明</div>
                    </div>
                    <div>
                        <label style="display:block;font-size:12px;color:#5B6B7A;margin-bottom:4px;">家长电话</label>
                        <div style="font-size:13px;color:#1F2D3D;">13901234567</div>
                    </div>
                </div>
            </div>
        </div>
        <div style="padding:12px 24px;border-top:1px solid #E5EAF3;display:flex;gap:8px;justify-content:flex-end;">
            <button onclick="closeModal()" style="padding:7px 16px;background:white;color:#5B6B7A;border:1px solid #E5EAF3;border-radius:6px;font-size:13px;cursor:pointer;">关闭</button>
        </div>
    `);
}

// ==================== 报到步骤配置 - 数据与函数 ====================

// 步骤数据（可运行时增删改）
// mode: 'seq' 顺序执行 / 'free' 自由并行；extLink: 外部跳转链接（空串=无）
let REPORT_STEPS = [
    { id: 's1', name: '完善信息',   desc: '填写个人信息、家庭信息、紧急联系人，完成后自动生成专属报到二维码',           required: true, enabled: true, icon: 'fas fa-edit',        builtin: true,  mode: 'seq',  extLink: '' },
    { id: 's2', name: '在线缴费',   desc: '跳转张家口银行缴费，老师扫码确认后自动生成学号；可走助学贷款或绿色通道',     required: true, enabled: true, icon: 'fas fa-credit-card', builtin: true,  mode: 'seq',  extLink: 'https://pay.example.edu.cn' },
    { id: 's3', name: '选择宿舍',   desc: '缴费确认后自主在线选择宿舍楼层房间床位，系统自动确认',                       required: true, enabled: true, icon: 'fas fa-bed',         builtin: false, mode: 'seq',  extLink: '' },
    { id: 's4', name: '物品领取',   desc: '前往各物资点领取材料、军训物品、教材；可通过外链预购校园商城物品',           required: true, enabled: true, icon: 'fas fa-box-open',    builtin: false, mode: 'free', extLink: 'https://shop.example.edu.cn' },
    { id: 's5', name: '办理一卡通', desc: '前往F101一卡通服务中心，工作人员扫报到二维码核验并发卡',                     required: true, enabled: true, icon: 'fas fa-id-card',     builtin: true,  mode: 'seq',  extLink: '' },
    { id: 's6', name: '注册易班',   desc: '点击跳转易班完成账号注册，搜索班级邀请码加入班级群（开学一周前同步）',       required: true, enabled: true, icon: 'fas fa-users',       builtin: false, mode: 'free', extLink: 'https://www.yiban.cn' }
];

// 渲染步骤列表 HTML
function renderStepsList() {
    return REPORT_STEPS.map((s, i) => `
        <div id="step-item-${s.id}" style="display:flex;align-items:center;gap:10px;padding:10px 12px;border:1px solid ${s.enabled ? '#E5EAF3' : '#F0F2F5'};border-radius:8px;margin-bottom:8px;background:${s.enabled ? 'white' : '#F9FAFB'};transition:all 0.2s;">
            <!-- 拖拽手柄 -->
            <i class="fas fa-grip-vertical" style="color:#BCC9D4;cursor:grab;font-size:14px;flex-shrink:0;" title="拖拽排序"></i>
            <!-- 步骤编号 -->
            <div style="width:28px;height:28px;background:${s.enabled ? '#1677FF' : '#E5EAF3'};border-radius:50%;display:flex;align-items:center;justify-content:center;color:${s.enabled ? 'white' : '#9AACBA'};font-size:12px;font-weight:700;flex-shrink:0;">${i + 1}</div>
            <!-- 步骤图标 -->
            <i class="${s.icon}" style="color:${s.enabled ? '#1677FF' : '#BCC9D4'};font-size:15px;width:18px;flex-shrink:0;"></i>
            <!-- 步骤信息 -->
            <div style="flex:1;min-width:0;">
                <div style="display:flex;align-items:center;flex-wrap:wrap;gap:5px;margin-bottom:2px;">
                    <span style="font-size:13px;font-weight:600;color:${s.enabled ? '#1F2D3D' : '#9AACBA'};">${s.name}</span>
                    <span style="font-size:10px;padding:1px 6px;border-radius:3px;border:1px solid ${(s.mode||'seq')==='free'?'#B5F5EC':'#D6E4FF'};background:${(s.mode||'seq')==='free'?'#E6FFFB':'#F0F5FF'};color:${(s.mode||'seq')==='free'?'#13C2C2':'#2F54EB'};">
                        ${(s.mode||'seq')==='free'?'⬡ 并行':'↕ 顺序'}
                    </span>
                    ${s.extLink ? '<span style="font-size:10px;padding:1px 6px;border-radius:3px;background:#FFF7E6;border:1px solid #FFD591;color:#D48806;">外链</span>' : ''}
                </div>
                <div style="font-size:11px;color:#9AACBA;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${s.desc}</div>
                ${s.extLink ? '<div style="font-size:10px;color:#1677FF;margin-top:2px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">↗ ' + s.extLink + '</div>' : ''}
            </div>
            <!-- 操作区 -->
            <div style="display:flex;align-items:center;gap:8px;flex-shrink:0;">
                <!-- 必填/选填切换 -->
                <button onclick="toggleStepRequired('${s.id}')" 
                        style="padding:3px 10px;font-size:11px;border-radius:4px;cursor:pointer;border:1px solid ${s.required ? '#FFCCC7' : '#D9F7BE'};background:${s.required ? '#FFF1F0' : '#F6FFED'};color:${s.required ? '#FF4D4F' : '#52C41A'};">
                    ${s.required ? '必填' : '选填'}
                </button>
                <!-- 启用/禁用开关 -->
                <div onclick="toggleStepEnabled('${s.id}')" 
                     style="width:38px;height:20px;background:${s.enabled ? '#1677FF' : '#D1D9E0'};border-radius:10px;position:relative;cursor:pointer;transition:background 0.2s;flex-shrink:0;" 
                     title="${s.enabled ? '点击禁用' : '点击启用'}">
                    <div style="width:16px;height:16px;background:white;border-radius:50%;position:absolute;top:2px;${s.enabled ? 'right:2px;' : 'left:2px;'}transition:all 0.2s;box-shadow:0 1px 3px rgba(0,0,0,0.15);"></div>
                </div>
                <!-- 编辑按钮 -->
                <button onclick="editStep('${s.id}')" style="width:28px;height:28px;background:white;color:#5B6B7A;border:1px solid #E5EAF3;border-radius:4px;cursor:pointer;font-size:12px;display:flex;align-items:center;justify-content:center;" title="编辑步骤">
                    <i class="fas fa-pen"></i>
                </button>
                <!-- 删除按钮（内置步骤不可删除） -->
                ${s.builtin
                    ? `<div style="width:28px;height:28px;display:flex;align-items:center;justify-content:center;" title="内置步骤不可删除"><i class="fas fa-lock" style="color:#D0D7DE;font-size:11px;"></i></div>`
                    : `<button onclick="deleteStep('${s.id}')" style="width:28px;height:28px;background:white;color:#FF4D4F;border:1px solid #FFCCC7;border-radius:4px;cursor:pointer;font-size:12px;display:flex;align-items:center;justify-content:center;" title="删除步骤"><i class="fas fa-trash-alt"></i></button>`
                }
            </div>
        </div>
    `).join('');
}

// 刷新步骤列表 DOM
function refreshStepsUI() {
    const container = document.getElementById('steps-config-list');
    if (container) container.innerHTML = renderStepsList();
    const total = REPORT_STEPS.length;
    const enabled = REPORT_STEPS.filter(s => s.enabled).length;
    const required = REPORT_STEPS.filter(s => s.required).length;
    const tc = document.getElementById('step-total-count');
    const ec = document.getElementById('step-enabled-count');
    const rc = document.getElementById('step-required-count');
    if (tc) tc.textContent = total;
    if (ec) ec.textContent = enabled;
    if (rc) rc.textContent = required;
}

// 切换必填/选填
function toggleStepRequired(id) {
    const s = REPORT_STEPS.find(x => x.id === id);
    if (!s) return;
    if (s.builtin) { showSuccess('内置步骤必填属性不可修改'); return; }
    s.required = !s.required;
    refreshStepsUI();
}

// 切换启用/禁用
function toggleStepEnabled(id) {
    const s = REPORT_STEPS.find(x => x.id === id);
    if (!s) return;
    if (s.builtin) { showSuccess('内置步骤不可禁用'); return; }
    s.enabled = !s.enabled;
    refreshStepsUI();
    showSuccess(s.enabled ? `已启用步骤：${s.name}` : `已禁用步骤：${s.name}`);
}

// 删除步骤
function deleteStep(id) {
    const s = REPORT_STEPS.find(x => x.id === id);
    if (!s) return;
    showModal(`
        <div style="padding:20px 24px;border-bottom:1px solid #E5EAF3;">
            <div style="font-size:16px;font-weight:600;color:#1F2D3D;">确认删除步骤</div>
        </div>
        <div style="padding:24px;">
            <div style="background:#FFF1F0;border:1px solid #FFCCC7;border-radius:6px;padding:12px 14px;display:flex;align-items:flex-start;gap:10px;">
                <i class="fas fa-exclamation-triangle" style="color:#FF4D4F;margin-top:2px;"></i>
                <div>
                    <div style="font-size:13px;font-weight:600;color:#FF4D4F;margin-bottom:4px;">即将删除步骤：${s.name}</div>
                    <div style="font-size:12px;color:#5B6B7A;">删除后学生端将不再显示此步骤，操作不可撤销。</div>
                </div>
            </div>
        </div>
        <div style="padding:12px 24px;border-top:1px solid #E5EAF3;display:flex;gap:8px;justify-content:flex-end;">
            <button onclick="closeModal()" style="padding:7px 16px;background:white;color:#5B6B7A;border:1px solid #E5EAF3;border-radius:6px;font-size:13px;cursor:pointer;">取消</button>
            <button onclick="confirmDeleteStep('${id}')" style="padding:7px 16px;background:#FF4D4F;color:white;border:none;border-radius:6px;font-size:13px;cursor:pointer;">确认删除</button>
        </div>
    `);
}

function confirmDeleteStep(id) {
    const idx = REPORT_STEPS.findIndex(x => x.id === id);
    if (idx === -1) return;
    const name = REPORT_STEPS[idx].name;
    REPORT_STEPS.splice(idx, 1);
    closeModal();
    refreshStepsUI();
    showSuccess(`步骤"${name}"已删除`);
}

// 编辑步骤
function editStep(id) {
    const s = REPORT_STEPS.find(x => x.id === id);
    if (!s) return;
    showModal(`
        <div style="padding:20px 24px;border-bottom:1px solid #E5EAF3;">
            <div style="font-size:16px;font-weight:600;color:#1F2D3D;">编辑步骤</div>
        </div>
        <div style="padding:24px;">
            <div style="margin-bottom:16px;">
                <label style="display:block;font-size:13px;color:#5B6B7A;margin-bottom:6px;">步骤名称 <span style="color:#FF4D4F;">*</span></label>
                <input id="edit-step-name" style="width:100%;padding:8px 12px;border:1px solid #E5EAF3;border-radius:6px;font-size:13px;outline:none;" value="${s.name}" placeholder="如：心理健康测评" />
            </div>
            <div style="margin-bottom:16px;">
                <label style="display:block;font-size:13px;color:#5B6B7A;margin-bottom:6px;">步骤说明</label>
                <input id="edit-step-desc" style="width:100%;padding:8px 12px;border:1px solid #E5EAF3;border-radius:6px;font-size:13px;outline:none;" value="${s.desc}" placeholder="在学生端显示的步骤描述" />
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
                <div>
                    <label style="display:block;font-size:13px;color:#5B6B7A;margin-bottom:6px;">步骤属性</label>
                    <select id="edit-step-required" style="width:100%;padding:8px 12px;border:1px solid #E5EAF3;border-radius:6px;font-size:13px;outline:none;">
                        <option value="true" ${s.required ? 'selected' : ''}>必填（不可跳过）</option>
                        <option value="false" ${!s.required ? 'selected' : ''}>选填（可跳过）</option>
                    </select>
                </div>
                <div>
                    <label style="display:block;font-size:13px;color:#5B6B7A;margin-bottom:6px;">启用状态</label>
                    <select id="edit-step-enabled" style="width:100%;padding:8px 12px;border:1px solid #E5EAF3;border-radius:6px;font-size:13px;outline:none;">
                        <option value="true" ${s.enabled ? 'selected' : ''}>已启用</option>
                        <option value="false" ${!s.enabled ? 'selected' : ''}>已禁用</option>
                    </select>
                </div>
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:14px;">
                <div>
                    <label style="display:block;font-size:13px;color:#5B6B7A;margin-bottom:6px;"><i class="fas fa-stream" style="color:#2F54EB;font-size:11px;"></i> 执行模式</label>
                    <select id="edit-step-mode" style="width:100%;padding:8px 12px;border:1px solid #E5EAF3;border-radius:6px;font-size:13px;outline:none;">
                        <option value="seq" ${(s.mode||'seq')==='seq' ? 'selected' : ''}>↕ 顺序执行（必须按序）</option>
                        <option value="free" ${s.mode==='free' ? 'selected' : ''}>⬡ 自由并行（可同时进行）</option>
                    </select>
                </div>
                <div></div>
            </div>
            <div style="margin-top:14px;">
                <label style="display:block;font-size:13px;color:#5B6B7A;margin-bottom:6px;"><i class="fas fa-external-link-alt" style="color:#FA8C16;font-size:11px;"></i> 外部跳转链接（选填）</label>
                <input id="edit-step-extlink" style="width:100%;padding:8px 12px;border:1px solid #E5EAF3;border-radius:6px;font-size:13px;outline:none;box-sizing:border-box;" value="${s.extLink||''}" placeholder="如：https://pay.edu.cn  留空则无外链按钮" />
                <div style="font-size:11px;color:#9AACBA;margin-top:4px;">配置后学生端该步骤显示"跳转外部链接"按钮</div>
            </div>
            ${s.builtin ? '<div style="margin-top:12px;padding:8px 12px;background:#FFF7E6;border:1px solid #FFD591;border-radius:6px;font-size:12px;color:#FA8C16;"><i class="fas fa-lock"></i> 内置步骤：名称和必填属性受限，执行模式与外链可调整</div>' : ''}
        </div>
        <div style="padding:12px 24px;border-top:1px solid #E5EAF3;display:flex;gap:8px;justify-content:flex-end;">
            <button onclick="closeModal()" style="padding:7px 16px;background:white;color:#5B6B7A;border:1px solid #E5EAF3;border-radius:6px;font-size:13px;cursor:pointer;">取消</button>
            <button onclick="saveEditStep('${id}')" style="padding:7px 16px;background:#1677FF;color:white;border:none;border-radius:6px;font-size:13px;cursor:pointer;">保存</button>
        </div>
    `);
}

function saveEditStep(id) {
    const s = REPORT_STEPS.find(x => x.id === id);
    if (!s) return;
    const name = document.getElementById('edit-step-name').value.trim();
    const desc = document.getElementById('edit-step-desc').value.trim();
    const required = document.getElementById('edit-step-required').value === 'true';
    const enabled = document.getElementById('edit-step-enabled').value === 'true';
    const mode = document.getElementById('edit-step-mode') ? document.getElementById('edit-step-mode').value : (s.mode||'seq');
    const extLink = document.getElementById('edit-step-extlink') ? document.getElementById('edit-step-extlink').value.trim() : (s.extLink||'');
    if (!name) { alert('请填写步骤名称'); return; }
    if (!s.builtin) {
        s.name = name;
        s.desc = desc;
        s.required = required;
        s.enabled = enabled;
    } else {
        s.enabled = enabled;
    }
    s.mode = mode;
    s.extLink = extLink;
    closeModal();
    refreshStepsUI();
    showSuccess(`步骤"${s.name}"已更新`);
}

// 添加新步骤弹窗
function addReportStep() {
    showModal(`
        <div style="padding:20px 24px;border-bottom:1px solid #E5EAF3;">
            <div style="font-size:16px;font-weight:600;color:#1F2D3D;">添加报到步骤</div>
            <div style="font-size:12px;color:#5B6B7A;margin-top:4px;">新步骤将添加到步骤列表末尾，可拖拽调整位置</div>
        </div>
        <div style="padding:24px;">
            <!-- 快捷模板 -->
            <div style="margin-bottom:20px;">
                <label style="display:block;font-size:13px;color:#5B6B7A;margin-bottom:8px;"><i class="fas fa-bolt" style="color:#FA8C16;"></i> 快捷模板（点击自动填入）</label>
                <div style="display:flex;flex-wrap:wrap;gap:8px;">
                    ${[
                        { name:'心理健康测评', desc:'完成在线心理健康评估问卷', icon:'fas fa-heart' },
                        { name:'体检报告上传', desc:'上传入学体检报告（PDF/图片）', icon:'fas fa-file-medical' },
                        { name:'军训报名',     desc:'完成军训营地和时间段选择', icon:'fas fa-user-soldier' },
                        { name:'领取物资',     desc:'到指定地点领取生活用品包', icon:'fas fa-box-open' },
                        { name:'签署承诺书',   desc:'阅读并签署学生行为承诺书', icon:'fas fa-file-signature' },
                        { name:'绑定家长',     desc:'绑定家长手机，开通家长通知', icon:'fas fa-user-friends' }
                    ].map(t => `
                        <button onclick="fillStepTemplate('${t.name}','${t.desc}')" 
                                style="padding:5px 12px;background:#F9FAFB;color:#1F2D3D;border:1px solid #E5EAF3;border-radius:6px;font-size:12px;cursor:pointer;transition:all 0.2s;"
                                onmouseover="this.style.borderColor='#1677FF';this.style.color='#1677FF'" 
                                onmouseout="this.style.borderColor='#E5EAF3';this.style.color='#1F2D3D'">
                            <i class="${t.icon}" style="margin-right:4px;"></i>${t.name}
                        </button>
                    `).join('')}
                </div>
            </div>
            <div style="margin-bottom:16px;">
                <label style="display:block;font-size:13px;color:#5B6B7A;margin-bottom:6px;">步骤名称 <span style="color:#FF4D4F;">*</span></label>
                <input id="new-step-name" style="width:100%;padding:8px 12px;border:1px solid #E5EAF3;border-radius:6px;font-size:13px;outline:none;" placeholder="请输入步骤名称（5字以内）" maxlength="8" />
            </div>
            <div style="margin-bottom:16px;">
                <label style="display:block;font-size:13px;color:#5B6B7A;margin-bottom:6px;">步骤说明</label>
                <input id="new-step-desc" style="width:100%;padding:8px 12px;border:1px solid #E5EAF3;border-radius:6px;font-size:13px;outline:none;" placeholder="在学生端显示的步骤描述（选填）" />
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
                <div>
                    <label style="display:block;font-size:13px;color:#5B6B7A;margin-bottom:6px;">步骤属性</label>
                    <select id="new-step-required" style="width:100%;padding:8px 12px;border:1px solid #E5EAF3;border-radius:6px;font-size:13px;outline:none;">
                        <option value="true">必填（不可跳过）</option>
                        <option value="false">选填（可跳过）</option>
                    </select>
                </div>
                <div>
                    <label style="display:block;font-size:13px;color:#5B6B7A;margin-bottom:6px;">插入位置</label>
                    <select id="new-step-position" style="width:100%;padding:8px 12px;border:1px solid #E5EAF3;border-radius:6px;font-size:13px;outline:none;">
                        <option value="end">末尾（${REPORT_STEPS.length + 1}）</option>
                        ${REPORT_STEPS.map((s, i) => `<option value="${i}">Step ${i + 1} ${s.name} 之前</option>`).join('')}
                    </select>
                </div>
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:14px;">
                <div>
                    <label style="display:block;font-size:13px;color:#5B6B7A;margin-bottom:6px;"><i class="fas fa-stream" style="color:#2F54EB;font-size:11px;"></i> 执行模式</label>
                    <select id="new-step-mode" style="width:100%;padding:8px 12px;border:1px solid #E5EAF3;border-radius:6px;font-size:13px;outline:none;">
                        <option value="seq">↕ 顺序执行（必须按序）</option>
                        <option value="free">⬡ 自由并行（可同时进行）</option>
                    </select>
                </div>
                <div></div>
            </div>
            <div style="margin-top:14px;">
                <label style="display:block;font-size:13px;color:#5B6B7A;margin-bottom:6px;"><i class="fas fa-external-link-alt" style="color:#FA8C16;font-size:11px;"></i> 外部跳转链接（选填）</label>
                <input id="new-step-extlink" style="width:100%;padding:8px 12px;border:1px solid #E5EAF3;border-radius:6px;font-size:13px;outline:none;box-sizing:border-box;" placeholder="如：https://form.edu.cn  留空则无外链按钮" />
                <div style="font-size:11px;color:#9AACBA;margin-top:4px;">配置后学生端该步骤显示"跳转外部链接"按钮</div>
            </div>
        </div>
        <div style="padding:12px 24px;border-top:1px solid #E5EAF3;display:flex;gap:8px;justify-content:flex-end;">
            <button onclick="closeModal()" style="padding:7px 16px;background:white;color:#5B6B7A;border:1px solid #E5EAF3;border-radius:6px;font-size:13px;cursor:pointer;">取消</button>
            <button onclick="saveNewStep()" style="padding:7px 16px;background:#1677FF;color:white;border:none;border-radius:6px;font-size:13px;cursor:pointer;"><i class="fas fa-plus"></i> 添加步骤</button>
        </div>
    `);
}

// 快捷模板填充
function fillStepTemplate(name, desc) {
    const nameEl = document.getElementById('new-step-name');
    const descEl = document.getElementById('new-step-desc');
    if (nameEl) nameEl.value = name;
    if (descEl) descEl.value = desc;
}

// 保存新步骤
function saveNewStep() {
    const name = document.getElementById('new-step-name').value.trim();
    const desc = document.getElementById('new-step-desc').value.trim();
    const required = document.getElementById('new-step-required').value === 'true';
    const position = document.getElementById('new-step-position').value;
    const mode = document.getElementById('new-step-mode') ? document.getElementById('new-step-mode').value : 'seq';
    const extLink = document.getElementById('new-step-extlink') ? document.getElementById('new-step-extlink').value.trim() : '';
    if (!name) { alert('请填写步骤名称'); return; }
    const newStep = {
        id: 'sc' + Date.now(),
        name, desc,
        required, enabled: true,
        icon: 'fas fa-check-square',
        builtin: false,
        mode, extLink
    };
    if (position === 'end') {
        REPORT_STEPS.push(newStep);
    } else {
        REPORT_STEPS.splice(parseInt(position), 0, newStep);
    }
    closeModal();
    refreshStepsUI();
    showSuccess(`步骤"${name}"已添加，共 ${REPORT_STEPS.length} 步`);
}

// 批量导出一卡通数据
function exportCardData() {
    showSuccess('正在导出一卡通数据...');
    setTimeout(() => {
        showSuccess('一卡通数据已导出：campus_card_2024.xlsx');
    }, 1500);
}


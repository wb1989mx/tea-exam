# 高级评茶员感官操作流程考核系统（手机离线版）

依据 **GB/T 23776-2018《茶叶感官审评方法》** 开发的移动端考核系统，支持 PWA 离线部署，可添加到手机主屏幕像原生 App 一样运行。

---

## 功能特性

- **多茶类题库**：铁观音、大红袍、滇红、龙井、白牡丹（5种茶样）
- **双审评方法**：柱形杯法（150mL/3g）+ 盖碗法（110mL/5g，三泡出汤）
- **四个考核环节**：器具选配 → 操作规范勾选 → 流程排序 → 评分结果
- **纯离线运行**：零外部依赖，雷达图用原生 Canvas 实现，无需联网
- **PWA 支持**：可添加到主屏幕，全屏运行，Service Worker 缓存
- **移动端优化**：触控友好（≥44px 点击区）、安全区域适配、横屏自适应

---

## 文件结构

```
tea-exam-mobile/
├── index.html          # 主页面（结构）
├── manifest.json       # PWA 应用清单
├── sw.js               # Service Worker（离线缓存）
├── README.md           # 本说明文件
├── css/
│   └── style.css       # 样式（移动端优化）
├── js/
│   ├── data.js         # 题库数据（茶类/器具/规范/流程）
│   ├── radar.js        # 纯 Canvas 雷达图
│   └── app.js          # 主应用逻辑
└── icons/
    └── icon.svg        # 应用图标（矢量）
```

---

## 部署方式

### 方式一：本地静态服务器（推荐）

由于 Service Worker 需要 HTTP/HTTPS 环境（不能直接 file:// 打开），需用本地服务器运行：

**Windows（Python 自带）：**
```bash
cd tea-exam-mobile
python -m http.server 8080
```
然后手机和电脑连同一 WiFi，手机浏览器访问 `http://电脑IP:8080`

**Node.js：**
```bash
npx serve tea-exam-mobile -l 8080
```

### 方式二：部署到静态托管

将整个 `tea-exam-mobile` 目录上传到任意静态托管服务：
- GitHub Pages / Gitee Pages
- 腾讯云 COS / 阿里云 OSS
- Vercel / Netlify
- 公司内网 Nginx

部署后访问对应 URL 即可。

### 方式三：直接打开（功能受限）

直接双击 `index.html` 可以正常使用考核功能，但 **PWA 离线缓存和添加到主屏幕功能不可用**（浏览器安全限制）。

---

## 添加到手机主屏幕

1. 用手机浏览器（Chrome / Safari /  Edge）打开部署后的网址
2. **Android（Chrome）**：右上角菜单 → "添加到主屏幕" / "安装应用"
3. **iOS（Safari）**：底部分享按钮 → "添加到主屏幕"
4. 主屏幕会出现"评茶考核"图标，点击即可全屏运行
5. 首次加载后，系统自动缓存所有资源，后续可完全离线使用

---

## 题库扩展

编辑 `js/data.js` 即可添加新茶类或修改参数：

```javascript
var TEA_LIB = {
  newTea: {
    name: '茶样名称',
    cat: '茶类',      // 乌龙茶/红茶/绿茶/白茶/黄茶/黑茶
    type: '外形类型',  // 颗粒型/条形/扁形/芽叶型等
    icon: '🍵',
    methods: ['cup', 'gaiwan'],  // 支持的审评方法
    cupTime: '5分钟',  // 柱形杯法冲泡时间
    desc: '描述'
  }
};
```

器具库、操作规范、流程步骤均可在 `data.js` 中对应位置修改。

---

## 评分权重

| 环节 | 权重 | 说明 |
|------|------|------|
| 器具选配 | 25% | 选对得分，选错倒扣0.5 |
| 操作规范 | 25% | 选对得分，选错倒扣0.5 |
| 流程顺序 | 35% | 逐位匹配正确率 |
| 时间效率 | 15% | 标准6分钟，越快越高 |

综合得分 ≥90 A级 / ≥75 B级 / ≥60 C级 / <60 D级

---

## 技术说明

- **零外部依赖**：不引用任何 CDN 库，雷达图用原生 Canvas 2D 实现
- **PWA**：manifest.json + Service Worker（Cache First 策略）
- **响应式**：CSS Grid + Flex，手机竖屏优先，横屏/平板自适应
- **安全区域**：适配刘海屏（`env(safe-area-inset-*)`）
- **触控优化**：所有可点击元素 ≥44×44px，禁用双击缩放

---

## 图标说明

`icons/icon.svg` 为矢量图标，可直接用于 PWA。如需 PNG 格式（兼容旧设备），可用以下方式转换：

- 在线工具：搜 "SVG to PNG" 上传转换，导出 192×192 和 512×512 两个尺寸
- 命令行（需 ImageMagick）：`convert -background none icon.svg -resize 192x192 icon-192.png`

转换后放入 `icons/` 目录即可，manifest.json 已预留 PNG 图标配置。

# Agents-X 博客网站

这是一个模仿现代科技公司风格的静态博客网站，专为GitHub Pages托管设计。该网站使用纯HTML、CSS和JavaScript构建，无需任何额外的构建步骤或服务器端处理。

## 特点

- 左侧导航，右侧内容的现代化布局
- 响应式设计，适配不同尺寸的屏幕
- 章节导航与内容滚动联动
- 多页面布局，包括主页和博客列表页
- 平滑的交互动画和效果
- 纯静态实现，适合GitHub Pages托管

## 文件结构

```
/
├── index.html         # 主页 - "Python is a good visual primitive"
├── blog.html          # 博客列表页
├── styles.css         # 共享样式
├── script.js          # 交互功能
└── README.md          # 项目说明
```

## 主要特性

### 左侧导航布局

网站采用了现代化的左侧固定导航栏布局，这种设计有几个优点：
- 提供清晰的内容层次结构和导航
- 在用户滚动时保持导航可见
- 为各个章节提供直接访问的链接
- 自动高亮当前查看的章节

### 章节联动

当用户滚动页面时，左侧导航会自动高亮显示当前正在查看的章节，使用户始终知道自己在文档中的位置。同样，点击左侧导航链接会平滑滚动到相应的章节。

## 部署到GitHub Pages

按照以下步骤将该网站部署到GitHub Pages：

1. 确保你的GitHub仓库名称为 `<用户名>.github.io` 或 `<组织名>.github.io`
2. 将所有文件推送到该仓库的主分支
3. 在GitHub仓库设置中，找到GitHub Pages部分
4. 将源设置为"Deploy from a branch"，并选择"main"分支
5. 点击"Save"保存设置

几分钟后，你的网站应该可以通过 `https://<用户名>.github.io` 或 `https://<组织名>.github.io` 访问。

## 本地开发

要在本地开发和测试网站，只需要将文件克隆到本地，然后使用任何简单的HTTP服务器启动：

```bash
# 如果安装了Python 3
python -m http.server

# 如果安装了Node.js
npx serve
```

然后在浏览器中访问 `http://localhost:8000` 或服务器指定的其他端口。

## 自定义

### 更改颜色主题

在`styles.css`文件中，修改根变量即可轻松更改网站的颜色主题：

```css
:root {
    --primary-color: #85abc0; /* 主色调 */
    --text-color: #121212;    /* 文本颜色 */
    /* 其他变量 */
}
```

### 修改侧边栏宽度

如果需要调整侧边栏的宽度，只需修改`styles.css`中的`--sidebar-width`变量：

```css
:root {
    --sidebar-width: 250px; /* 侧边栏宽度 */
    /* 其他变量 */
}
```

### 添加新章节

1. 在HTML中添加新的章节内容，为其添加一个唯一的ID：
```html
<h2 id="new-section">New Section Title</h2>
<p>Section content goes here...</p>
```

2. 在左侧导航中添加对应的链接：
```html
<li><a href="#new-section">New Section</a></li>
```

### 添加新博客文章

在`blog.html`文件中找到`.blog-grid`部分，然后添加新的博客卡片：

```html
<article class="blog-card">
    <div class="blog-card-image">
        <img src="图片URL" alt="图片描述">
    </div>
    <div class="blog-card-content">
        <div class="blog-card-date">日期</div>
        <h2 class="blog-card-title">标题</h2>
        <p class="blog-card-excerpt">
            文章摘要...
        </p>
        <a href="文章链接.html" class="blog-card-link">
            Read more <span>→</span>
        </a>
    </div>
</article>
```

## 许可证

MIT 
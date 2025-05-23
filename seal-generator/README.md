# 印章生成器 (Seal Generator)

一个基于 TypeScript 和 Node.js Canvas 的印章生成工具。

## 功能特点

- 支持自定义印章大小、颜色、透明度
- 支持自定义公司名称和印章标题
- 支持实线和虚线边框
- 支持印章旋转
- 支持自定义字体大小

## 安装

```bash
# 克隆项目
git clone [项目地址]

# 安装依赖
npm install

# 添加字体文件
# 将 SimHei 字体文件 (simhei.ttf) 复制到 fonts 目录
```

## 使用方法

1. 确保 `fonts` 目录中有 `simhei.ttf` 字体文件
2. 运行以下命令：

```bash
# 开发模式（支持热重载）
npm run dev

# 或者构建后运行
npm run build
npm start
```

生成的印章将保存在 `output` 目录下。

## 配置选项

```typescript
interface SealOptions {
  size?: number; // 印章大小，默认 400
  color?: string; // 印章颜色，默认 #FF0000
  company?: string; // 公司名称，默认 "测试公司"
  title?: string; // 印章标题，默认 "合同专用章"
  starSize?: number; // 五角星大小，默认 60
  companyFontSize?: number; // 公司名称字体大小，默认 24
  titleFontSize?: number; // 标题字体大小，默认 20
  rotation?: number; // 旋转角度，默认 0
  opacity?: number; // 透明度，默认 1.0
  borderWidth?: number; // 边框宽度，默认 6
  borderStyle?: "solid" | "dashed"; // 边框样式，默认 'solid'
}
```

## 注意事项

- 需要安装 Node.js 环境
- 需要安装 canvas 依赖的系统库
- 需要中文字体文件支持

## 许可证

ISC

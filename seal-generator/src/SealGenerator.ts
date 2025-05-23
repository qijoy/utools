import { createCanvas, registerFont, CanvasRenderingContext2D } from "canvas";
import * as fs from "fs";
import * as path from "path";

/**
 * 印章配置选项接口
 */
interface SealOptions {
  /** 印章整体大小（像素） */
  size?: number;
  /** 印章颜色（十六进制颜色代码） */
  color?: string;
  /** 公司名称 */
  company?: string;
  /** 印章标题（如：合同专用章） */
  title?: string;
  /** 五角星大小（像素） */
  starSize?: number;
  /** 公司名称字体大小（像素） */
  companyFontSize?: number;
  /** 标题字体大小（像素） */
  titleFontSize?: number;
  /** 印章旋转角度（度） */
  rotation?: number;
  /** 印章透明度（0-1） */
  opacity?: number;
  /** 边框宽度（像素） */
  borderWidth?: number;
  /** 边框样式：实线或虚线 */
  borderStyle?: "solid" | "dashed";
  /** 公司名称排列半径比例（相对于印章半径） */
  companyRadiusRatio?: number;
  /** 标题位置比例（相对于印章半径） */
  titleRadiusRatio?: number;
  /** 五角星下方空白区域角度 */
  starBottomAngle?: number;
  /** 是否显示内圈 */
  showInnerCircle?: boolean;
  /** 是否做旧 */
  aging?: boolean;
  /** 做旧强度（0-1，默认0.12） */
  agingStrength?: number;
}

/**
 * 印章生成器类
 */
export class SealGenerator {
  /** 印章配置选项 */
  private options: Required<SealOptions>;

  /**
   * 构造函数
   * @param options 印章配置选项
   */
  constructor(options: SealOptions = {}) {
    this.options = {
      size: options.size || 400, // 默认印章大小 400px
      color: options.color || "#FF0000", // 默认红色
      company: options.company || "测试公司", // 默认公司名
      title: options.title || " ", // 默认标题
      starSize: options.starSize || 100, // 默认五角星大小 100px
      companyFontSize: options.companyFontSize || 24, // 默认公司名称字体大小 24px
      titleFontSize: options.titleFontSize || 20, // 默认标题字体大小 20px
      rotation: options.rotation || 0, // 默认不旋转
      opacity: options.opacity || 1.0, // 默认不透明
      borderWidth: options.borderWidth || 6, // 默认边框宽度 6px
      borderStyle: options.borderStyle || "solid", // 默认实线边框
      companyRadiusRatio: options.companyRadiusRatio || 0.75,
      titleRadiusRatio: options.titleRadiusRatio || 0.33,
      starBottomAngle: options.starBottomAngle || 108,
      showInnerCircle:
        options.showInnerCircle !== undefined ? options.showInnerCircle : true,
      aging: options.aging !== undefined ? options.aging : true,
      agingStrength:
        options.agingStrength !== undefined ? options.agingStrength : 0.13,
    };

    this.registerFonts();
  }

  /**
   * 注册字体
   * 尝试加载 SimHei 字体，如果失败则使用系统默认字体
   */
  private registerFonts(): void {
    try {
      const fontPath = path.join(__dirname, "../fonts/simhei.ttf");
      registerFont(fontPath, { family: "SimHei" });
    } catch (error) {
      console.warn("无法加载字体文件，将使用默认字体");
    }
  }

  /**
   * 生成印章
   * @param outputPath 输出文件路径
   * @returns 生成的印章文件路径
   */
  public async generate(outputPath: string): Promise<string> {
    const {
      size,
      color,
      company,
      title,
      starSize,
      companyFontSize,
      titleFontSize,
      rotation,
      opacity,
      borderWidth,
      borderStyle,
      companyRadiusRatio,
      titleRadiusRatio,
      starBottomAngle,
    } = this.options;

    // 创建画布
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext("2d");

    // 清空画布
    ctx.clearRect(0, 0, size, size);
    // 不要绘制任何背景色

    // 设置透明度
    ctx.globalAlpha = opacity;

    // 移动到中心点并旋转
    ctx.translate(size / 2, size / 2);
    ctx.rotate((rotation * Math.PI) / 180);

    // 按顺序绘制印章的各个部分
    this.drawBorder(ctx, size / 2 - 20, color, borderWidth, borderStyle);
    this.drawStar(ctx, 0, 0, starSize, color);
    this.drawCompanyName(
      ctx,
      company,
      size / 2 - 20,
      companyFontSize,
      color,
      companyRadiusRatio
    );
    this.drawTitle(
      ctx,
      title,
      size / 2 - 20,
      titleFontSize,
      color,
      titleRadiusRatio
    );

    // 保存为 PNG 文件前做旧
    if (this.options.aging) {
      this.addAgingEffect(ctx, size, this.options.agingStrength);
    }
    const buffer = canvas.toBuffer("image/png");
    await fs.promises.writeFile(outputPath, buffer);

    return outputPath;
  }

  /**
   * 绘制印章边框（外圈+内圈）
   */
  private drawBorder(
    ctx: CanvasRenderingContext2D,
    radius: number,
    color: string,
    width: number,
    style: "solid" | "dashed"
  ): void {
    // 外圈
    ctx.save();
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.shadowColor = "rgba(0, 0, 0, 0.08)";
    ctx.shadowBlur = 2;
    if (style === "solid") {
      ctx.arc(0, 0, radius, 0, Math.PI * 2);
      ctx.stroke();
    } else {
      for (let angle = 0; angle < 360; angle += 10) {
        const startAngle = (angle * Math.PI) / 180;
        const endAngle = ((angle + 5) * Math.PI) / 180;
        ctx.beginPath();
        ctx.arc(0, 0, radius, startAngle, endAngle);
        ctx.stroke();
      }
    }
    ctx.restore();
    // 内圈（可选）
    if (this.options.showInnerCircle) {
      ctx.save();
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = Math.max(2, width * 0.5);
      ctx.shadowBlur = 0;
      ctx.arc(0, 0, radius - 12, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }
  }

  /**
   * 绘制五角星（加描边）
   */
  private drawStar(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    size: number,
    color: string
  ): void {
    const star = "★";
    ctx.save();
    ctx.font = `bold ${size}px SimHei`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    // 阴影
    ctx.shadowColor = "rgba(0, 0, 0, 0.12)";
    ctx.shadowBlur = 2;
    // 填充
    ctx.fillStyle = color;
    ctx.fillText(star, x, y);
    // 描边
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#a00000";
    ctx.shadowBlur = 0;
    ctx.strokeText(star, x, y);
    ctx.restore();
  }

  /**
   * 绘制公司名称（圆形排列，字间距、加粗模拟）
   */
  private drawCompanyName(
    ctx: CanvasRenderingContext2D,
    text: string,
    radius: number,
    fontSize: number,
    color: string,
    radiusRatio: number
  ): void {
    const chars = text.split("");
    // 让公司名称分布在220°圆弧上，左右对齐
    const totalAngle = 240; // 更松散
    const angleStep = totalAngle / (chars.length - 1);
    const startAngle = -90 - totalAngle / 2;

    ctx.font = `bold ${fontSize}px SimHei`;
    ctx.fillStyle = color;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    chars.forEach((char, i) => {
      const angle = ((startAngle + i * angleStep) * Math.PI) / 180;
      const x = radius * radiusRatio * Math.cos(angle);
      const y = radius * radiusRatio * Math.sin(angle);
      ctx.save();
      ctx.translate(x, y);
      let rotationAngle = angle + Math.PI / 2;
      ctx.rotate(rotationAngle);
      // 阴影
      ctx.shadowColor = "rgba(0, 0, 0, 0.10)";
      ctx.shadowBlur = 2;
      ctx.shadowOffsetX = 1;
      ctx.shadowOffsetY = 1;
      ctx.lineWidth = 1.2;
      ctx.strokeStyle = color;
      ctx.strokeText(char, 0, 0);
      ctx.fillText(char, 0, 0);
      ctx.restore();
    });
  }

  /**
   * 绘制印章标题
   * @param ctx Canvas 2D 上下文
   * @param text 标题文本
   * @param radius 印章半径
   * @param fontSize 字体大小
   * @param color 文字颜色
   * @param radiusRatio 位置比例
   */
  private drawTitle(
    ctx: CanvasRenderingContext2D,
    text: string,
    radius: number,
    fontSize: number,
    color: string,
    radiusRatio: number
  ): void {
    ctx.font = `${fontSize}px SimHei`;
    ctx.fillStyle = color;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    // 添加文字阴影效果
    ctx.shadowColor = "rgba(0, 0, 0, 0.1)";
    ctx.shadowBlur = 2;
    ctx.shadowOffsetX = 1;
    ctx.shadowOffsetY = 1;
    ctx.fillText(text, 0, radius * radiusRatio);
  }

  /**
   * 添加做旧颗粒噪点、边缘破损、局部掉色效果
   */
  private addAgingEffect(
    ctx: CanvasRenderingContext2D,
    size: number,
    strength: number
  ) {
    const imageData = ctx.getImageData(0, 0, size, size);
    const data = imageData.data;
    const cx = size / 2;
    const cy = size / 2;
    const radius = size / 2 - 20;
    // 生成1~2个局部掉色椭圆区域
    const fadeAreas = Array.from({ length: 2 }, () => ({
      x: cx + (Math.random() - 0.5) * radius * 0.7,
      y: cy + (Math.random() - 0.5) * radius * 0.7,
      rx: 30 + Math.random() * 30,
      ry: 18 + Math.random() * 18,
      fade: 0.5 + Math.random() * 0.2, // 掉色强度
    }));
    for (let i = 0; i < data.length; i += 4) {
      const x = (i / 4) % size;
      const y = Math.floor(i / 4 / size);
      // 到圆心距离
      const dist = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
      // 只对非透明像素做旧
      if (data[i + 3] > 0) {
        // 1. 整体颜色变淡
        data[i] = data[i] * (0.93 - strength * 0.2); // R
        data[i + 1] = data[i + 1] * (0.93 - strength * 0.1); // G
        data[i + 2] = data[i + 2] * (0.93 - strength * 0.1); // B
        // 2. 颗粒噪点
        const noise = (Math.random() - 0.5) * 255 * strength * 0.7;
        data[i] = Math.max(0, Math.min(255, data[i] + noise));
        data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise * 0.5));
        data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise * 0.5));
        // 3. 边缘破损（外圈8px内，概率性透明或变淡）
        if (dist > radius - 8 && dist < radius + 8) {
          if (Math.random() < 0.13 * strength) {
            data[i + 3] = data[i + 3] * (0.5 + Math.random() * 0.3); // 透明
          } else if (Math.random() < 0.18 * strength) {
            data[i] = data[i] * 0.7; // R
            data[i + 1] = data[i + 1] * 0.7;
            data[i + 2] = data[i + 2] * 0.7;
          }
        }
        // 4. 局部掉色
        for (const area of fadeAreas) {
          const dx = (x - area.x) / area.rx;
          const dy = (y - area.y) / area.ry;
          if (dx * dx + dy * dy < 1) {
            data[i] = data[i] * area.fade;
            data[i + 1] = data[i + 1] * area.fade;
            data[i + 2] = data[i + 2] * area.fade;
            data[i + 3] = data[i + 3] * (0.92 + Math.random() * 0.06);
          }
        }
        // 5. 轻微透明度变化
        data[i + 3] = Math.max(
          0,
          Math.min(255, data[i + 3] * (0.97 + Math.random() * 0.06))
        );
      }
    }
    ctx.putImageData(imageData, 0, 0);
  }
}

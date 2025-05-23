import { SealGenerator } from "./SealGenerator";
import * as path from "path";
import * as fs from "fs";

/**
 * 主函数：批量生成公章
 */
async function main() {
  // 自动创建 output 目录
  fs.mkdirSync(path.join(__dirname, "../output"), { recursive: true });

  // 读取公司名称，逗号分隔
  const txtPath = path.join(__dirname, "../1.txt");
  let companies: string[] = [];
  if (fs.existsSync(txtPath)) {
    const content = fs.readFileSync(txtPath, "utf-8");
    companies = content
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }

  if (companies.length > 0) {
    for (const company of companies) {
      const generator = new SealGenerator({
        company,
        title: " ",
        size: 452,
        color: "#d20000",
        rotation: 0,
        opacity: 1,
        borderStyle: "solid",
        starSize: 150,
        companyFontSize: 60,
        titleFontSize: 28,
        borderWidth: 7,
        companyRadiusRatio: 0.75,
        titleRadiusRatio: 0.3,
        starBottomAngle: 108,
        showInnerCircle: false,
        aging: false,
        agingStrength: 0.13,
      });

      // 生成印章并保存到 output 目录，文件名用公司名
      const safeName = company.replace(/[\\/:*?"<>|\\s]/g, "_");
      const outputPath = path.join(__dirname, `../output/${safeName}.png`);
      await generator.generate(outputPath);
      console.log(`印章已生成: ${outputPath}`);
    }
  } else {
    // ...生成默认章
    const generator = new SealGenerator({
      company: "河北理铭科技有限公司",
      title: " ",
      size: 452,
      color: "#d20000",
      rotation: 0,
      opacity: 1,
      borderStyle: "solid",
      starSize: 150,
      companyFontSize: 60,
      titleFontSize: 28,
      borderWidth: 7,
      companyRadiusRatio: 0.75,
      titleRadiusRatio: 0.3,
      starBottomAngle: 108,
      showInnerCircle: false,
      aging: false,
      agingStrength: 0.13,
    });
    const outputPath = path.join(__dirname, "../output/default.png");
    await generator.generate(outputPath);
    console.log(`未检测到公司名，已生成默认章: ${outputPath}`);
  }
}

// 运行主函数
main().catch(console.error);

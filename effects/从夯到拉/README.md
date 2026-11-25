# 从夯到拉

用于随身 WiFi 锐评的 Remotion 横屏片头。五张等级卡沿弧线循环轮播，整组出画后依次回场，在左侧落位。快速运动使用子帧曝光合成拖影，右侧标题固定。

## 使用

在仓库根目录安装依赖并启动 Remotion Studio。

```sh
npm ci
npm start
```

在 `Effects` 文件夹中选择合成 `CongHangDaoLa`。导出成片可运行：

```sh
npx remotion render CongHangDaoLa out/cong-hang-dao-la.mp4
```

成片为 1920 × 1080、60 fps、8 秒。字体从仓库的 `public/fonts/` 加载。

import * as velite from 'velite';

// 如果 withVelite 在命名空间里
const withVelite = velite.withVelite || velite.default?.withVelite;

/** @type {import('next').NextConfig} */
const nextConfig = {
  // 你的配置
};

export default typeof withVelite === 'function' ? withVelite(nextConfig) : nextConfig;
// 网站基本配置
export const siteConfig = {
  // 个人信息
  name: "余忆",
  title: "白日梦想家 | 敲代码ing",
  bio: "人类的赞歌就是勇气的赞歌",
  
  // 导航菜单
  nav: [
    { name: "关于我", href: "/#about" },
    { name: "题解", href: "/#solutions" },
    { name: "项目", href: "/#projects" },
    { name: "联系我", href: "/#contact" }
  ],
  
  // 管理员菜单
  adminNav: [
    { name: "题解管理", href: "/admin/solutions" },
    { name: "留言管理", href: "/admin/messages" },
    { name: "用户管理", href: "/admin/users" }
  ],
  
  // 关于我
  about: {
    description: [
      "这里是你的详细介绍，可以包括你的教育背景、工作经历、专业领域等信息。使用简洁现代的文字风格，让读者能够快速了解你的经历和专长。",
      "这段文字可以展示你的价值观、职业目标或者你的工作方法论。展示你的独特性和专业性，让访问者对你产生兴趣。"
    ],
    education: {
      school: "CUMTB - CST‌",
      period: "2018 - 2022"
    },
    experience: {
      company: "Inspur - RD",
      period: "2022 - 2023"
    }
  },
  
  // 社交媒体链接
  social: {
    github: {
      url: "https://github.com/Krita623",
      username: "Krita623"
    },
    // QQ配置 - username字段是实际复制给用户的QQ号，nickname可选，用于显示QQ昵称
    qq: {
      number: "1942196710", // 这是您的QQ号，点击图标时会复制这个号码
      nickname: "Vive la liberté", // 您的QQ昵称，可选
      copyTip: "点击复制QQ号" // 鼠标悬停时的提示文字
    },
    bilibili: {
      url: "https://space.bilibili.com/11417944",
      username: "忆忆忆12138"
    },
    email: "17667847837@163.com"
  },
  
  // 联系表单
  contact: {
    title: "联系我",
    description: "如果您对我的工作感兴趣，或者想要了解更多信息，请随时联系我。我很乐意回答您的问题或讨论可能的合作机会。"
  },
  
  // 项目展示
  projects: [
    {
      title: "项目名称 1",
      description: "项目简短描述，介绍这个项目的主要功能和特点。尽量简洁明了地表达项目的价值。",
      image: "/project-1.jpg",
      tags: ["标签1", "标签2"],
      link: "#"
    },
    {
      title: "项目名称 2",
      description: "项目简短描述，介绍这个项目的主要功能和特点。尽量简洁明了地表达项目的价值。",
      image: "/project-2.jpg",
      tags: ["标签1", "标签2"],
      link: "#"
    },
    {
      title: "项目名称 3",
      description: "项目简短描述，介绍这个项目的主要功能和特点。尽量简洁明了地表达项目的价值。",
      image: "/project-3.jpg",
      tags: ["标签1", "标签2"],
      link: "#"
    }
  ],
  
  // Hero部分按钮
  heroButtons: [
    { text: "联系我", href: "#contact", isPrimary: true },
    { text: "查看题解", href: "#solutions", isPrimary: false }
  ],
  
  // SEO配置
  seo: {
    description: "余忆的个人网站，展示个人信息和刷题题解",
    keywords: "个人网站, 刷题题解, 程序员, 后端开发"
  }
} 
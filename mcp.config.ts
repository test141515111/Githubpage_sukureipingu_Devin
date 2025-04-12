/**
 * MCP (Modular Code Processing) Configuration
 * Used for defining development workflows and tasks
 */

export default {
  dev_tasks: [
    {
      name: "RSSログ監視機構導入",
      steps: [
        {
          name: "ログ出力機能",
          config: {
            log_level: "DEBUG"
          }
        },
        {
          name: "ロガー構造整理",
          config: {
            pattern: "Clean Architecture"
          }
        },
        {
          name: "意図的な例外テスト",
          config: {
            target: "logger_stream"
          }
        }
      ]
    }
  ],
  
  logger: {
    levels: ["DEBUG", "INFO", "WARN", "ERROR"],
    default: "INFO",
    outputs: ["console", "file"]
  },
  
  rss: {
    update_interval: 5, // minutes
    max_items: 10,
    feeds: [
      "https://news.yahoo.co.jp/rss/topics/top-picks.xml"
    ]
  }
};

// 只在服务端使用：读取 agent 地址和服务令牌，构造带 X-Service-Token 的请求。
// adminProxy 和 /api/chat 共用，不要在客户端组件里 import。

export class AgentConfigError extends Error {}

function getAgentConfig(): { url: string; serviceToken: string } {
  const url = process.env.AI_AGENT_URL
  if (!url) {
    throw new AgentConfigError('Missing AI_AGENT_URL environment variable')
  }
  const serviceToken = process.env.AI_AGENT_SERVICE_TOKEN
  if (!serviceToken) {
    throw new AgentConfigError('Missing AI_AGENT_SERVICE_TOKEN environment variable')
  }
  return { url, serviceToken }
}

/**
 * 向 agent 发请求。path 以 / 开头（如 `/chat`、`/admin/autobiography`），
 * search 是原样附加的查询串（含或不含 `?` 都行）。环境变量缺失时抛 AgentConfigError，
 * 调用方要放在 try 里处理。
 */
export async function fetchAgent(
  path: string,
  init: { method?: string; body?: string; search?: string } = {}
): Promise<Response> {
  const { url, serviceToken } = getAgentConfig()
  const target = new URL(`${url}${path}`)
  if (init.search) target.search = init.search

  return fetch(target, {
    method: init.method ?? 'GET',
    headers: {
      'Content-Type': 'application/json',
      'X-Service-Token': serviceToken,
    },
    body: init.body,
  })
}

interface JSONResult {
  success: boolean
  output?: string
  error?: string
}

interface ValidateResult {
  valid: boolean
  error: string | null
}

/**
 * 美化 JSON 字符串，使用 2 空格缩进
 */
export function formatJSON(input: string): JSONResult {
  try {
    const parsed = JSON.parse(input)
    return { success: true, output: JSON.stringify(parsed, null, 2) }
  } catch (e) {
    const msg = e instanceof Error ? e.message : '未知错误'
    return { success: false, error: msg }
  }
}

/**
 * 压缩 JSON 字符串，移除所有不必要空格
 */
export function compressJSON(input: string): JSONResult {
  try {
    const parsed = JSON.parse(input)
    return { success: true, output: JSON.stringify(parsed) }
  } catch (e) {
    const msg = e instanceof Error ? e.message : '未知错误'
    return { success: false, error: msg }
  }
}

/**
 * 校验 JSON 字符串是否有效
 */
export function validateJSON(input: string): ValidateResult {
  try {
    JSON.parse(input)
    return { valid: true, error: null }
  } catch (e) {
    const msg = e instanceof Error ? e.message : '未知错误'
    return { valid: false, error: msg }
  }
}

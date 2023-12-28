export const SITE_NAME = "Mindmap Flow"

export const REDIS_URL = process.env.REDIS_URL
export const REDIS_PASS = process.env.REDIS_PASS
export const REDIS_USER = process.env.REDIS_USER || "default"
export const REDIS_NAMESPACE = process.env.REDIS_NAMESPACE || "mindmap"

export const isProduction = process.env.NODE_ENV === "production"

export const SECRET_KEY = process.env.SECRET_KEY

export const PATHS = {
  home: "/",
  auth: {
    login: "/login",
    register: "/register",
  },
  mindmap: "/mindmap",
  myMindmaps: "/mindmaps",
}

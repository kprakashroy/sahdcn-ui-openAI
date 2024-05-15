const requestCounts = new Map();
const windowMs = 60000; 
const maxRequests = 2; 

export async function rateLimitMiddleware(request:Request) {
  let ip = request['headers'].get("x-forwarded-for") || request['headers'].get("cf-connecting-ip") || request['headers'].get("cf-ipcountry") ;


  if (ip && ip.includes(",")) {
    ip = ip.split(",")[0].trim();
  }

  if (requestCounts.has(ip)) {
    const requestsInWindow = requestCounts.get(ip);

    if (requestsInWindow >= maxRequests) {
      return true; 
    } else {
      requestCounts.set(ip, requestsInWindow + 1);
      return false
    }
  } else {
    requestCounts.set(ip, 1);
    const timeoutId = setTimeout(() => {
        requestCounts.delete(ip);
      }, windowMs);
      return false
  }


}
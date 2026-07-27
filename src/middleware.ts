import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { SUPABASE_ANON_KEY, SUPABASE_URL, supabaseConfigured } from "@/lib/supabase/config";

/**
 * Refreshes the Supabase session cookie on every admin request and redirects
 * unauthenticated visitors to the login page.
 *
 * The auth check happens here rather than only in the layout so an
 * unauthenticated request never reaches a page that reads data.
 */
export async function middleware(request: NextRequest) {
  const response = NextResponse.next({ request });

  // Without Supabase configured there is no auth to enforce, and /admin would
  // be a dead end. Send visitors home rather than into a broken login form.
  if (!supabaseConfigured) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        );
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const isLogin = pathname === "/admin/login";

  if (!user && !isLogin) {
    const url = new URL("/admin/login", request.url);
    // Preserve the intended destination so login can bounce back to it.
    if (pathname !== "/admin") url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  if (user && isLogin) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};

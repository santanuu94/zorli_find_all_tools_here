module.exports = [
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[project]/app/categories/[category]/page.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>CategoryPage,
    "generateMetadata",
    ()=>generateMetadata,
    "generateStaticParams",
    ()=>generateStaticParams
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$api$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/next/dist/api/navigation.react-server.js [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/components/navigation.react-server.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$data$2f$categories$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/data/categories.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$data$2f$tools$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/data/tools.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$navigation$2f$Navbar$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/navigation/Navbar.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$footer$2f$Footer$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/footer/Footer.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$categories$2f$CategoryPageClient$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/categories/CategoryPageClient.tsx [app-rsc] (ecmascript)");
;
;
;
;
;
;
;
async function generateStaticParams() {
    return __TURBOPACK__imported__module__$5b$project$5d2f$data$2f$categories$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["CATEGORIES"].map((cat)=>({
            category: cat.slug
        }));
}
async function generateMetadata({ params }) {
    const { category: slug } = await params;
    const category = (0, __TURBOPACK__imported__module__$5b$project$5d2f$data$2f$categories$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getCategoryBySlug"])(slug);
    if (!category) {
        return {
            title: "Category Not Found"
        };
    }
    return {
        title: `${category.name} — Free Online Utilities`,
        description: category.description,
        openGraph: {
            title: `${category.name} | Zorli`,
            description: category.description
        }
    };
}
async function CategoryPage({ params }) {
    const { category: slug } = await params;
    const category = (0, __TURBOPACK__imported__module__$5b$project$5d2f$data$2f$categories$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getCategoryBySlug"])(slug);
    if (!category) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["notFound"])();
    }
    const tools = (0, __TURBOPACK__imported__module__$5b$project$5d2f$data$2f$tools$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getToolsByCategory"])(category.slug);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex flex-col min-h-screen bg-[#070B24]",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$navigation$2f$Navbar$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Navbar"], {}, void 0, false, {
                fileName: "[project]/app/categories/[category]/page.tsx",
                lineNumber: 52,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                className: "flex-1 w-full",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$categories$2f$CategoryPageClient$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["CategoryPageClient"], {
                    category: category,
                    tools: tools
                }, void 0, false, {
                    fileName: "[project]/app/categories/[category]/page.tsx",
                    lineNumber: 54,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/categories/[category]/page.tsx",
                lineNumber: 53,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$footer$2f$Footer$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Footer"], {}, void 0, false, {
                fileName: "[project]/app/categories/[category]/page.tsx",
                lineNumber: 56,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/categories/[category]/page.tsx",
        lineNumber: 51,
        columnNumber: 5
    }, this);
}
}),
"[project]/app/categories/[category]/page.tsx [app-rsc] (ecmascript, Next.js Server Component)", (function(__turbopack_context__){

__turbopack_context__.n(__turbopack_context__.i("[project]/app/categories/[category]/page.tsx [app-rsc] (ecmascript)"));
}),
"[project]/app/favicon.ico (static in ecmascript, tag client)", ((__turbopack_context__) => {

__turbopack_context__.v("/_next/static/media/favicon.2vob68tjqpejf.ico" + (globalThis["NEXT_CLIENT_ASSET_SUFFIX"] || ''));}),
"[project]/app/favicon.ico.mjs { IMAGE => \"[project]/app/favicon.ico (static in ecmascript, tag client)\" } [app-rsc] (structured image object, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$favicon$2e$ico__$28$static__in__ecmascript$2c$__tag__client$29$__ = __turbopack_context__.i("[project]/app/favicon.ico (static in ecmascript, tag client)");
;
const __TURBOPACK__default__export__ = {
    src: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$favicon$2e$ico__$28$static__in__ecmascript$2c$__tag__client$29$__["default"],
    width: 256,
    height: 256
};
}),
"[project]/components/categories/CategoryPageClient.tsx [app-rsc] (client reference proxy)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CategoryPageClient",
    ()=>CategoryPageClient,
    "default",
    ()=>__TURBOPACK__default__export__
]);
// This file is generated by next-core EcmascriptClientReferenceModule.
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const CategoryPageClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call CategoryPageClient() from the server but CategoryPageClient is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/components/categories/CategoryPageClient.tsx", "CategoryPageClient");
const __TURBOPACK__default__export__ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call the default export of [project]/components/categories/CategoryPageClient.tsx from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/components/categories/CategoryPageClient.tsx", "default");
}),
"[project]/components/categories/CategoryPageClient.tsx [app-rsc] (client reference proxy) <module evaluation>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CategoryPageClient",
    ()=>CategoryPageClient,
    "default",
    ()=>__TURBOPACK__default__export__
]);
// This file is generated by next-core EcmascriptClientReferenceModule.
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const CategoryPageClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call CategoryPageClient() from the server but CategoryPageClient is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/components/categories/CategoryPageClient.tsx <module evaluation>", "CategoryPageClient");
const __TURBOPACK__default__export__ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call the default export of [project]/components/categories/CategoryPageClient.tsx <module evaluation> from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/components/categories/CategoryPageClient.tsx <module evaluation>", "default");
}),
"[project]/components/categories/CategoryPageClient.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$categories$2f$CategoryPageClient$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/components/categories/CategoryPageClient.tsx [app-rsc] (client reference proxy) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$categories$2f$CategoryPageClient$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__ = __turbopack_context__.i("[project]/components/categories/CategoryPageClient.tsx [app-rsc] (client reference proxy)");
;
__turbopack_context__.n(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$categories$2f$CategoryPageClient$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__);
}),
"[project]/components/footer/Footer.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Footer",
    ()=>Footer,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.react-server.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$brand$2f$ZorliLogo$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/brand/ZorliLogo.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$heart$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Heart$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/heart.mjs [app-rsc] (ecmascript) <export default as Heart>");
;
;
;
;
function TwitterXIcon({ className = "w-4 h-4" }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        className: className,
        viewBox: "0 0 24 24",
        fill: "currentColor",
        "aria-hidden": "true",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
            d: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
        }, void 0, false, {
            fileName: "[project]/components/footer/Footer.tsx",
            lineNumber: 9,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/footer/Footer.tsx",
        lineNumber: 8,
        columnNumber: 5
    }, this);
}
function YoutubeIcon({ className = "w-4 h-4" }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        className: className,
        viewBox: "0 0 24 24",
        fill: "currentColor",
        "aria-hidden": "true",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
            d: "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"
        }, void 0, false, {
            fileName: "[project]/components/footer/Footer.tsx",
            lineNumber: 17,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/footer/Footer.tsx",
        lineNumber: 16,
        columnNumber: 5
    }, this);
}
function GithubIcon({ className = "w-4 h-4" }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        className: className,
        viewBox: "0 0 24 24",
        fill: "currentColor",
        "aria-hidden": "true",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
            fillRule: "evenodd",
            clipRule: "evenodd",
            d: "M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
        }, void 0, false, {
            fileName: "[project]/components/footer/Footer.tsx",
            lineNumber: 25,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/footer/Footer.tsx",
        lineNumber: 24,
        columnNumber: 5
    }, this);
}
function LinkedinIcon({ className = "w-4 h-4" }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        className: className,
        viewBox: "0 0 24 24",
        fill: "currentColor",
        "aria-hidden": "true",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
            d: "M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"
        }, void 0, false, {
            fileName: "[project]/components/footer/Footer.tsx",
            lineNumber: 37,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/footer/Footer.tsx",
        lineNumber: 36,
        columnNumber: 5
    }, this);
}
function Footer() {
    const currentYear = new Date().getFullYear();
    const footerLinks = [
        {
            label: "Home",
            href: "/"
        },
        {
            label: "Tools",
            href: "/tools"
        },
        {
            label: "Categories",
            href: "/categories"
        },
        {
            label: "About",
            href: "/about"
        },
        {
            label: "Blog",
            href: "/blog"
        },
        {
            label: "Contact",
            href: "/contact"
        },
        {
            label: "Privacy",
            href: "/privacy"
        },
        {
            label: "Terms",
            href: "/terms"
        }
    ];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("footer", {
        className: "w-full bg-[#070B24] border-t border-white/10 text-white/80 transition-colors",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex flex-col md:flex-row items-center justify-between gap-8 pb-10 border-b border-white/10",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-col items-center md:items-start text-center md:text-left gap-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$brand$2f$ZorliLogo$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ZorliLogo"], {
                                    variant: "full",
                                    theme: "dark",
                                    size: "md"
                                }, void 0, false, {
                                    fileName: "[project]/components/footer/Footer.tsx",
                                    lineNumber: 62,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-sm text-white/60 font-normal",
                                    children: "Simple Tools. A Smarter You."
                                }, void 0, false, {
                                    fileName: "[project]/components/footer/Footer.tsx",
                                    lineNumber: 63,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/footer/Footer.tsx",
                            lineNumber: 61,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                            className: "flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm",
                            "aria-label": "Footer navigation",
                            children: footerLinks.map((link)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
                                    href: link.href,
                                    className: "text-white/70 hover:text-white transition-colors duration-200",
                                    children: link.label
                                }, link.label, false, {
                                    fileName: "[project]/components/footer/Footer.tsx",
                                    lineNumber: 71,
                                    columnNumber: 15
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/components/footer/Footer.tsx",
                            lineNumber: 69,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-4 text-white/60",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                    href: "https://twitter.com",
                                    target: "_blank",
                                    rel: "noopener noreferrer",
                                    className: "p-2 rounded-lg hover:text-white hover:bg-white/10 transition-colors",
                                    "aria-label": "Zorli on X",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(TwitterXIcon, {
                                        className: "w-4 h-4"
                                    }, void 0, false, {
                                        fileName: "[project]/components/footer/Footer.tsx",
                                        lineNumber: 90,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/footer/Footer.tsx",
                                    lineNumber: 83,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                    href: "https://youtube.com",
                                    target: "_blank",
                                    rel: "noopener noreferrer",
                                    className: "p-2 rounded-lg hover:text-white hover:bg-white/10 transition-colors",
                                    "aria-label": "Zorli on YouTube",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(YoutubeIcon, {
                                        className: "w-4 h-4"
                                    }, void 0, false, {
                                        fileName: "[project]/components/footer/Footer.tsx",
                                        lineNumber: 99,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/footer/Footer.tsx",
                                    lineNumber: 92,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                    href: "https://github.com",
                                    target: "_blank",
                                    rel: "noopener noreferrer",
                                    className: "p-2 rounded-lg hover:text-white hover:bg-white/10 transition-colors",
                                    "aria-label": "Zorli on GitHub",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(GithubIcon, {
                                        className: "w-4 h-4"
                                    }, void 0, false, {
                                        fileName: "[project]/components/footer/Footer.tsx",
                                        lineNumber: 108,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/footer/Footer.tsx",
                                    lineNumber: 101,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                    href: "https://linkedin.com",
                                    target: "_blank",
                                    rel: "noopener noreferrer",
                                    className: "p-2 rounded-lg hover:text-white hover:bg-white/10 transition-colors",
                                    "aria-label": "Zorli on LinkedIn",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(LinkedinIcon, {
                                        className: "w-4 h-4"
                                    }, void 0, false, {
                                        fileName: "[project]/components/footer/Footer.tsx",
                                        lineNumber: 117,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/footer/Footer.tsx",
                                    lineNumber: 110,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/footer/Footer.tsx",
                            lineNumber: 82,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/footer/Footer.tsx",
                    lineNumber: 59,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/50",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            children: [
                                "© ",
                                currentYear,
                                " Zorli. All rights reserved."
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/footer/Footer.tsx",
                            lineNumber: 124,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "inline-flex items-center gap-1.5",
                            children: [
                                "Made with ",
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$heart$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Heart$3e$__["Heart"], {
                                    className: "w-3.5 h-3.5 text-purple-400 fill-purple-400 inline"
                                }, void 0, false, {
                                    fileName: "[project]/components/footer/Footer.tsx",
                                    lineNumber: 126,
                                    columnNumber: 23
                                }, this),
                                " for a better web."
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/footer/Footer.tsx",
                            lineNumber: 125,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/footer/Footer.tsx",
                    lineNumber: 123,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/footer/Footer.tsx",
            lineNumber: 58,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/footer/Footer.tsx",
        lineNumber: 57,
        columnNumber: 5
    }, this);
}
const __TURBOPACK__default__export__ = Footer;
}),
"[project]/components/navigation/Navbar.tsx [app-rsc] (client reference proxy)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Navbar",
    ()=>Navbar,
    "default",
    ()=>__TURBOPACK__default__export__
]);
// This file is generated by next-core EcmascriptClientReferenceModule.
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const Navbar = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call Navbar() from the server but Navbar is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/components/navigation/Navbar.tsx", "Navbar");
const __TURBOPACK__default__export__ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call the default export of [project]/components/navigation/Navbar.tsx from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/components/navigation/Navbar.tsx", "default");
}),
"[project]/components/navigation/Navbar.tsx [app-rsc] (client reference proxy) <module evaluation>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Navbar",
    ()=>Navbar,
    "default",
    ()=>__TURBOPACK__default__export__
]);
// This file is generated by next-core EcmascriptClientReferenceModule.
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const Navbar = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call Navbar() from the server but Navbar is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/components/navigation/Navbar.tsx <module evaluation>", "Navbar");
const __TURBOPACK__default__export__ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call the default export of [project]/components/navigation/Navbar.tsx <module evaluation> from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/components/navigation/Navbar.tsx <module evaluation>", "default");
}),
"[project]/components/navigation/Navbar.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$navigation$2f$Navbar$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/components/navigation/Navbar.tsx [app-rsc] (client reference proxy) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$navigation$2f$Navbar$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__ = __turbopack_context__.i("[project]/components/navigation/Navbar.tsx [app-rsc] (client reference proxy)");
;
__turbopack_context__.n(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$navigation$2f$Navbar$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__);
}),
"[project]/data/categories.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CATEGORIES",
    ()=>CATEGORIES,
    "getCategoryBySlug",
    ()=>getCategoryBySlug
]);
const CATEGORIES = [
    {
        id: "images",
        slug: "images",
        name: "Image Tools",
        shortName: "Image",
        description: "Compress, resize, convert and edit images effortlessly.",
        iconName: "Image",
        accentColor: "#4F8CFF",
        bgGradient: "from-blue-500/10 to-indigo-500/10",
        iconColor: "text-blue-500",
        toolCountNotice: "11+ tools planned",
        featured: true
    },
    {
        id: "pdf",
        slug: "pdf",
        name: "PDF Tools",
        shortName: "PDF",
        description: "Merge, split, compress and convert documents without clutter.",
        iconName: "FileText",
        accentColor: "#F43F5E",
        bgGradient: "from-rose-500/10 to-pink-500/10",
        iconColor: "text-rose-500",
        toolCountNotice: "6+ tools planned",
        featured: true
    },
    {
        id: "developer",
        slug: "developer",
        name: "Developer Tools",
        shortName: "Developer",
        description: "Format, validate and transform developer data and code.",
        iconName: "Code2",
        accentColor: "#8B5CF6",
        bgGradient: "from-purple-500/10 to-violet-500/10",
        iconColor: "text-purple-500",
        toolCountNotice: "8+ tools planned",
        featured: true
    },
    {
        id: "text",
        slug: "text",
        name: "Text Tools",
        shortName: "Text",
        description: "Count, clean, convert, format and analyze text fast.",
        iconName: "Type",
        accentColor: "#F59E0B",
        bgGradient: "from-amber-500/10 to-orange-500/10",
        iconColor: "text-amber-500",
        toolCountNotice: "5+ tools planned",
        featured: true
    },
    {
        id: "calculators",
        slug: "calculators",
        name: "Calculator Tools",
        shortName: "Calculators",
        description: "Solve, convert, and calculate numbers for everyday tasks.",
        iconName: "Calculator",
        accentColor: "#10B981",
        bgGradient: "from-emerald-500/10 to-teal-500/10",
        iconColor: "text-emerald-500",
        toolCountNotice: "7+ tools planned",
        featured: true
    },
    {
        id: "social",
        slug: "social",
        name: "Social Tools",
        shortName: "Social",
        description: "Generate, download, format and optimize social media workflows.",
        iconName: "Share2",
        accentColor: "#6366F1",
        bgGradient: "from-indigo-500/10 to-blue-500/10",
        iconColor: "text-indigo-500",
        toolCountNotice: "5+ tools planned",
        featured: true
    },
    {
        id: "more",
        slug: "more",
        name: "More Tools",
        shortName: "More",
        description: "Even more browser utilities and converters regularly coming soon.",
        iconName: "LayoutGrid",
        accentColor: "#64748B",
        bgGradient: "from-slate-500/10 to-zinc-500/10",
        iconColor: "text-slate-500",
        toolCountNotice: "Continuously growing",
        featured: false
    }
];
function getCategoryBySlug(slug) {
    return CATEGORIES.find((c)=>c.slug.toLowerCase() === slug.toLowerCase() || c.id.toLowerCase() === slug.toLowerCase());
}
}),
"[project]/data/tools.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TOOLS_REGISTRY",
    ()=>TOOLS_REGISTRY,
    "getAllTools",
    ()=>getAllTools,
    "getPopularTools",
    ()=>getPopularTools,
    "getRelatedTools",
    ()=>getRelatedTools,
    "getToolBySlug",
    ()=>getToolBySlug,
    "getToolsByCategory",
    ()=>getToolsByCategory,
    "searchTools",
    ()=>searchTools
]);
const TOOLS_REGISTRY = [
    // --- Image Tools ---
    {
        slug: "image-compressor",
        name: "Image Compressor",
        shortName: "Compressor",
        description: "Reduce image file size without losing quality.",
        longDescription: "Compress JPEG, PNG, WebP, and SVG images directly in your browser. Optimize your photos for web performance and quick sharing without uploading files to remote servers.",
        category: "images",
        subCategory: "optimize",
        iconName: "ImageDown",
        status: "coming-soon",
        popular: true,
        featured: true,
        badge: "Popular",
        tags: [
            "image",
            "compress",
            "optimize",
            "jpg",
            "png",
            "webp",
            "size reduction"
        ],
        howItWorks: [
            "Drop your image or browse your device to select the file.",
            "Choose your desired compression level or target file size.",
            "Preview the visual comparison between original and compressed output.",
            "Download your optimized image instantly."
        ],
        keyFeatures: [
            "Client-side processing for high speed and data privacy",
            "Lossy and lossless compression mode presets",
            "Side-by-side visual difference preview slider",
            "Batch compression capability planned"
        ],
        faqs: [
            {
                question: "Does Zorli upload my photos to an external server?",
                answer: "Zorli is engineered with a privacy-first mindset. Image processing tools are designed to run client-side right inside your browser whenever possible."
            },
            {
                question: "Which file formats are supported?",
                answer: "JPEG, PNG, WebP, SVG, and modern mobile image standards like HEIC."
            },
            {
                question: "Is there a limit on image dimensions?",
                answer: "We support standard photo resolutions from web banners up to high-resolution camera exports."
            }
        ]
    },
    {
        slug: "image-resizer",
        name: "Image Resizer",
        description: "Resize your images to any dimensions.",
        longDescription: "Scale down or adapt image width and height with preserved aspect ratio or custom pixel targets.",
        category: "images",
        subCategory: "edit",
        iconName: "Maximize2",
        status: "coming-soon",
        popular: false,
        featured: true,
        tags: [
            "image",
            "resize",
            "scale",
            "dimensions",
            "aspect ratio"
        ],
        howItWorks: [
            "Select your image file.",
            "Enter new pixel dimensions or scale by percentage.",
            "Lock aspect ratio to prevent stretching.",
            "Save the resized image."
        ],
        keyFeatures: [
            "Lock or unlock aspect ratio",
            "Preset dimensions for social platforms",
            "Sharpening filter on downscaling"
        ]
    },
    {
        slug: "image-converter",
        name: "Image Converter",
        description: "Convert between JPG, PNG, WebP and more.",
        longDescription: "Transform images across modern formats with controllable color depth and transparency handling.",
        category: "images",
        subCategory: "convert",
        iconName: "FileImage",
        status: "coming-soon",
        popular: false,
        featured: true,
        tags: [
            "convert",
            "png",
            "jpg",
            "jpeg",
            "webp",
            "svg"
        ],
        howItWorks: [
            "Upload images",
            "Select target format",
            "Download converted assets"
        ],
        keyFeatures: [
            "Transparent PNG to JPG background filling",
            "High-efficiency WebP conversion"
        ]
    },
    {
        slug: "image-cropper",
        name: "Image Cropper",
        description: "Crop your images to the perfect size.",
        longDescription: "Trim, crop, and reframe images for profile pictures, social media banners, and print.",
        category: "images",
        subCategory: "edit",
        iconName: "Crop",
        status: "coming-soon",
        popular: false,
        featured: true,
        tags: [
            "crop",
            "cut",
            "trim",
            "square",
            "profile"
        ],
        howItWorks: [
            "Load your image",
            "Drag crop handles or select ratio (1:1, 16:9, 4:3)",
            "Export cropped result"
        ],
        keyFeatures: [
            "Freeform & fixed aspect ratios",
            "Rotation & flip tools",
            "Pixel-perfect grid overlay"
        ]
    },
    {
        slug: "heic-to-jpg",
        name: "HEIC to JPG",
        description: "Convert HEIC images to JPG easily.",
        longDescription: "Instantly turn Apple iPhone HEIC/HEIF photos into universally compatible JPEG images.",
        category: "images",
        subCategory: "convert",
        iconName: "Smartphone",
        status: "coming-soon",
        popular: true,
        featured: true,
        tags: [
            "heic",
            "jpg",
            "apple",
            "iphone",
            "convert"
        ],
        howItWorks: [
            "Select HEIC files from your device",
            "Watch instant conversion",
            "Download ready-to-share JPEGs"
        ],
        keyFeatures: [
            "Preserves EXIF orientation and metadata",
            "Batch processing",
            "No quality degradation"
        ]
    },
    {
        slug: "jpg-to-webp",
        name: "JPG to WebP",
        description: "Convert JPG images to WebP for smaller size.",
        longDescription: "Next-gen web image format conversion for blazing fast websites and reduced bandwidth.",
        category: "images",
        subCategory: "convert",
        iconName: "Zap",
        status: "coming-soon",
        tags: [
            "webp",
            "jpg",
            "web performance",
            "seo",
            "bandwidth"
        ]
    },
    {
        slug: "image-rotator",
        name: "Image Rotator",
        description: "Rotate your images by 90°, 180° or custom angle.",
        longDescription: "Fix camera orientation or spin images precisely with lossless rotation.",
        category: "images",
        subCategory: "edit",
        iconName: "RotateCw",
        status: "coming-soon",
        tags: [
            "rotate",
            "orientation",
            "flip",
            "mirror"
        ]
    },
    {
        slug: "image-enhancer",
        name: "Image Enhancer",
        description: "Improve image quality, contrast, and brightness instantly.",
        longDescription: "Adjust brightness, contrast, saturation, and sharpness with instant real-time canvas preview.",
        category: "images",
        subCategory: "optimize",
        iconName: "Sparkles",
        status: "coming-soon",
        tags: [
            "enhance",
            "contrast",
            "brightness",
            "filters",
            "color"
        ]
    },
    {
        slug: "image-splitter",
        name: "Image Splitter",
        description: "Split a large image into smaller parts or grids.",
        longDescription: "Divide panoramic images into carousels or split pictures into grid tiles.",
        category: "images",
        subCategory: "edit",
        iconName: "SplitSquareVertical",
        status: "coming-soon",
        tags: [
            "split",
            "grid",
            "carousel",
            "tiles"
        ]
    },
    {
        slug: "image-merger",
        name: "Image Merger",
        description: "Merge multiple images into one seamless composite.",
        longDescription: "Stitch multiple pictures horizontally or vertically with custom margins.",
        category: "images",
        subCategory: "edit",
        iconName: "Layers",
        status: "coming-soon",
        tags: [
            "merge",
            "combine",
            "stitch",
            "collage"
        ]
    },
    {
        slug: "image-to-pdf",
        name: "Image to PDF",
        description: "Convert images to a single PDF file.",
        longDescription: "Pack individual or multi-page photos and documents into a clean PDF binder.",
        category: "images",
        subCategory: "convert",
        iconName: "FileText",
        status: "coming-soon",
        tags: [
            "pdf",
            "binder",
            "document",
            "photos to pdf"
        ]
    },
    // --- PDF Tools ---
    {
        slug: "pdf-compressor",
        name: "PDF Compressor",
        description: "Shrink PDF document size while preserving crisp text.",
        longDescription: "Streamline heavy PDF documents for email attachments and portal uploads without font corruption.",
        category: "pdf",
        iconName: "FileDown",
        status: "coming-soon",
        popular: true,
        featured: true,
        badge: "Popular",
        tags: [
            "pdf",
            "compress",
            "shrink",
            "optimize",
            "email size"
        ]
    },
    {
        slug: "pdf-merge",
        name: "PDF Merge",
        description: "Combine multiple PDF files into one clean document.",
        longDescription: "Drag and drop PDF pages and files to assemble a unified document in your exact order.",
        category: "pdf",
        iconName: "FilePlus",
        status: "coming-soon",
        popular: true,
        tags: [
            "pdf",
            "merge",
            "combine",
            "binder"
        ]
    },
    {
        slug: "pdf-splitter",
        name: "PDF Splitter",
        description: "Extract specific pages or break a PDF into separate files.",
        longDescription: "Select single pages or ranges to export into distinct lightweight files.",
        category: "pdf",
        iconName: "Scissors",
        status: "coming-soon",
        tags: [
            "pdf",
            "split",
            "extract",
            "pages"
        ]
    },
    // --- Developer Tools ---
    {
        slug: "json-formatter",
        name: "JSON Formatter & Validator",
        description: "Format, beautify, validate, and minify JSON payloads.",
        longDescription: "Inspect syntax errors, format messy payloads, collapse tree nodes, and copy minified output.",
        category: "developer",
        iconName: "Code2",
        status: "coming-soon",
        popular: true,
        featured: true,
        badge: "Popular",
        tags: [
            "json",
            "format",
            "beautify",
            "validate",
            "minify",
            "developer",
            "api"
        ]
    },
    {
        slug: "base64-converter",
        name: "Base64 Encoder / Decoder",
        description: "Encode text and files to Base64 or decode Base64 back to text.",
        longDescription: "Quickly convert strings, data URIs, and binary content into Base64 format.",
        category: "developer",
        iconName: "Binary",
        status: "coming-soon",
        tags: [
            "base64",
            "decode",
            "encode",
            "binary",
            "data-uri"
        ]
    },
    {
        slug: "regex-tester",
        name: "Regex Tester",
        description: "Test regular expressions with real-time match highlighting.",
        longDescription: "Debug pattern matches, capture groups, and substitution flags interactively.",
        category: "developer",
        iconName: "SearchCode",
        status: "coming-soon",
        tags: [
            "regex",
            "regexp",
            "regular expressions",
            "pattern",
            "matcher"
        ]
    },
    // --- Text Tools ---
    {
        slug: "word-counter",
        name: "Word & Character Counter",
        description: "Count words, characters, sentences, reading time, and density.",
        longDescription: "Instant real-time text analysis for writers, marketers, and essayists.",
        category: "text",
        iconName: "Type",
        status: "coming-soon",
        popular: true,
        featured: true,
        tags: [
            "word count",
            "character count",
            "reading time",
            "text analyzer"
        ]
    },
    {
        slug: "markdown-to-html",
        name: "Markdown to HTML Converter",
        description: "Convert Markdown syntax into clean semantic HTML markup.",
        longDescription: "Transform GitHub-flavored markdown into sanitized HTML snippets with live preview.",
        category: "text",
        iconName: "FileCode",
        status: "coming-soon",
        tags: [
            "markdown",
            "html",
            "converter",
            "gfm",
            "syntax"
        ]
    },
    // --- Calculator Tools ---
    {
        slug: "percentage-calculator",
        name: "Percentage Calculator",
        description: "Calculate discounts, percentage increases, and differences.",
        longDescription: "Solve common math problems: what is X% of Y, percent change, and tip calculations.",
        category: "calculators",
        iconName: "Percent",
        status: "coming-soon",
        popular: true,
        tags: [
            "percentage",
            "discount",
            "math",
            "increase",
            "calculator"
        ]
    },
    {
        slug: "aspect-ratio-calculator",
        name: "Aspect Ratio Calculator",
        description: "Compute scaled dimensions for 16:9, 4:3, 1:1 and custom ratios.",
        longDescription: "Keep video, photography, and UI proportions mathematically aligned during resizing.",
        category: "calculators",
        iconName: "Ratio",
        status: "coming-soon",
        tags: [
            "aspect ratio",
            "dimensions",
            "resolution",
            "scaling",
            "video"
        ]
    },
    // --- Social Tools ---
    {
        slug: "qr-code-generator",
        name: "QR Code Generator",
        description: "Generate clean custom QR codes for links, text, and Wi-Fi.",
        longDescription: "Create download-ready high resolution SVG and PNG QR codes with customizable color schemes.",
        category: "social",
        iconName: "QrCode",
        status: "coming-soon",
        popular: true,
        featured: true,
        tags: [
            "qr code",
            "generator",
            "link",
            "wifi",
            "social"
        ]
    }
];
function getAllTools() {
    return TOOLS_REGISTRY;
}
function getToolsByCategory(categorySlug) {
    return TOOLS_REGISTRY.filter((t)=>t.category.toLowerCase() === categorySlug.toLowerCase());
}
function getToolBySlug(slug) {
    return TOOLS_REGISTRY.find((t)=>t.slug.toLowerCase() === slug.toLowerCase());
}
function getPopularTools(limit = 6) {
    return TOOLS_REGISTRY.filter((t)=>t.popular).slice(0, limit);
}
function getRelatedTools(currentTool, limit = 3) {
    return TOOLS_REGISTRY.filter((t)=>t.category === currentTool.category && t.slug !== currentTool.slug).slice(0, limit);
}
function searchTools(query) {
    const clean = query.trim().toLowerCase();
    if (!clean) return [];
    return TOOLS_REGISTRY.filter((t)=>t.name.toLowerCase().includes(clean) || t.description.toLowerCase().includes(clean) || t.tags.some((tag)=>tag.toLowerCase().includes(clean)));
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__0986t3m._.js.map
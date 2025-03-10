declare module '*.svg' {
    import React from 'react';
    /**
     * **⚠️ Svg import specificities:**
     * -------------------------------
     * If coming from a **statics** folder => `String`.
     * *(The static path processed by webpack)*
     * 
     * Else => `React.FunctionComponent<React.SVGProps<SVGSVGElement>>`.
     * *(Transformation made by babel)*
     */
    const svgExport : React.FunctionComponent<React.SVGProps<SVGSVGElement> & { title?: string }> ;
    export default svgExport
}
declare module '*.gif' {
    const staticsContent: string;
    export default  staticsContent;
}
declare module '*.jpg' {
    const staticsContent: string;
    export default  staticsContent;
}
declare module '*.jpeg' {
    const staticsContent: string;
    export default  staticsContent;
}
declare module '*.png' {
    const staticsContent: string;
    export default  staticsContent;
}

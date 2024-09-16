import { Helmet } from "react-helmet-async";

const SEO = ({ title, image }: { title: string; image: string }) => (
    <Helmet>
        <title>{title}</title>
        <meta name="title" content="Furxus - Furry Nexus" />
        <meta
            name="description"
            content="Connect with other furries across the globe"
        />
        <meta name="keywords" content="furxus, furry, furry nexus, fursona" />
        <meta name="robots" content="index, follow" />
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="language" content="English" />
        <meta name="author" content="Furxus" />

        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://furxus.com" />
        <meta property="og:title" content="Furxus - Furry Nexus" />
        <meta
            property="og:description"
            content="Connect with other furries across the globe"
        />
        <meta property="og:image" content="/og.png" />

        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://furxus.com" />
        <meta property="twitter:title" content="Furxus - Furry Nexus" />
        <meta
            property="twitter:description"
            content="Connect with other furries across the globe"
        />
        <meta property="twitter:image" content="/og.png" />

        <link rel="manifest" href="/site.webmanifest" />
        <link rel="icon" href={image} />

        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link
            rel="apple-touch-icon"
            sizes="152x152"
            href="/apple-touch-icon.png"
        />
        <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/apple-touch-icon.png"
        />
        <link
            rel="apple-touch-icon"
            sizes="167x167"
            href="/apple-touch-icon.png"
        />
        <link
            rel="apple-touch-icon"
            sizes="120x120"
            href="/apple-touch-icon.png"
        />
        <link
            rel="apple-touch-icon"
            sizes="76x76"
            href="/apple-touch-icon.png"
        />
        <link
            rel="apple-touch-icon"
            sizes="60x60"
            href="/apple-touch-icon.png"
        />
        <link
            rel="apple-touch-icon"
            sizes="57x57"
            href="/apple-touch-icon.png"
        />
        <link
            rel="apple-touch-icon"
            sizes="72x72"
            href="/apple-touch-icon.png"
        />
        <link
            rel="apple-touch-icon"
            sizes="114x114"
            href="/apple-touch-icon.png"
        />
        <link
            rel="apple-touch-icon"
            sizes="144x144"
            href="/apple-touch-icon.png"
        />

        <meta name="viewport" content="initial-scale=1, width=device-width" />
    </Helmet>
);

export default SEO;

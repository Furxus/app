import { Helmet } from "react-helmet-async";

const SEO = ({ title, image }: { title: string; image: string }) => (
    <Helmet>
        <title>{title}</title>
        <meta name="title" content="Furxus - Furry Nexus" />
        <meta
            name="description"
            content="Connect with other furries across the globe"
        />

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

        <link rel="icon" href={image} />
        <meta name="viewport" content="initial-scale=1, width=device-width" />
    </Helmet>
);

export default SEO;

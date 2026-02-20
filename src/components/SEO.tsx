import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
    title?: string;
    description?: string;
    image?: string;
    url?: string;
    type?: string;
}

const SEO: React.FC<SEOProps> = ({
    title = 'Mantty Host - Gestión de Mantenimiento en Unidades Habitacionales',
    description = 'Mantty es la plataforma líder para la gestión de mantenimiento en unidades habitacionales (UH).',
    image = '/og-image.link', // Placeholder for actual brand image
    url = 'https://host.mantty.co',
    type = 'website'
}) => {
    const siteTitle = title.includes('Mantty Host') ? title : `${title} | Mantty Host`;

    return (
        <Helmet>
            {/* Standard metadata */}
            <title>{siteTitle}</title>
            <meta name="description" content={description} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:title" content={siteTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image} />
            <meta property="og:url" content={url} />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={siteTitle} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={image} />

            {/* Canonical Link */}
            <link rel="canonical" href={url} />
        </Helmet>
    );
};

export default SEO;

import { Fragment, createElement, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import htm from 'htm';
import { API_URL } from './config.js';

// `class` becomes `className`, so templates can be written like normal HTML.
const h = (type, props, ...children) => {
    if (props && props.class !== undefined) {
        const { class: className, ...rest } = props;
        props = { ...rest, className };
    }
    return createElement(type, props, ...children);
};

export const html = htm.bind(h);
export { Fragment, createPortal, useEffect, useRef, useState };

// Foto hero dan kartu ID adalah aset statis frontend (folder public/images), disajikan oleh Cloudflare.
const base = import.meta.env.BASE_URL;
export const IMG = {
    home: base + 'images/home.webp',
    about: base + 'images/about.webp',
};

// CV diunduh langsung dari backend (lihat routes/web.php di folder backend).
export const CV_URL = API_URL + '/cv/download';

export const NAV = [
    ['about', 'About'],
    ['skills', 'Skills'],
    ['projects', 'Projects'],
    ['experience', 'Experience'],
    ['certs', 'Certificates'],
    ['testi', 'Testimonials'],
    ['blog', 'Blog'],
    ['contact', 'Contact'],
];

export const go = (route) => {
    location.hash = route;
};

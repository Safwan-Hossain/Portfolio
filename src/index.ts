import dataJson from './data/portfolio.json';
import { PortfolioData } from './types/PortfolioTypes';
import { Renderer } from './components/Renderer';

const data: PortfolioData = dataJson;
const renderer = new Renderer(data);
renderer.renderAll();


const btn = document.querySelector<HTMLButtonElement>('.nav-toggle');
const links = document.querySelector<HTMLDivElement>('.nav-links');

if (btn && links) {
    btn.addEventListener('pointerup', (e) => {
        e.preventDefault();
        const open = btn.classList.toggle('open');
        links.classList.toggle('open', open);
        btn.setAttribute('aria-expanded', String(open));
    });

    document.querySelectorAll<HTMLAnchorElement>('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            btn.classList.remove('open');
            links.classList.remove('open');
            btn.setAttribute('aria-expanded', 'false');
        });
    });
}

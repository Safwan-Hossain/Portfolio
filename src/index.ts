import dataJson from './data/portfolio.json';
import { PortfolioData } from './types/PortfolioTypes';
import { Renderer } from './components/Renderer';

const data: PortfolioData = dataJson;
const renderer = new Renderer(data);
renderer.renderAll();

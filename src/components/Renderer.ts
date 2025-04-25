import { PortfolioData, Project, ProjectLink } from '../types/PortfolioTypes';

export class Renderer {
    constructor(private data: PortfolioData) {}

    renderAll(): void {
        this.renderNav();
        this.renderProfile();
        this.renderProjects();
        this.renderExperience();
        this.renderContact();
        this.renderEducation();
        this.renderFooter();
        this.renderTagCollapse();
    }

    // ============ NAVIGATION ========


    private renderNav(): void {
        const logoEl = document.getElementById('logo');
        const navLinksEl = document.getElementById('navLinks');
        if (!logoEl || !navLinksEl) return;

        logoEl.innerHTML = this.data.logo;
        this.data.nav.forEach((navItem) => {
            const a = document.createElement('a');
            a.textContent = navItem.label;
            a.href = navItem.href;
            if (navItem.external) a.target = '_blank';
            navLinksEl.appendChild(a);
        });
    }



    // =============== PROFILE ==================================

    private renderProfile(): void {
        const profileEl = document.getElementById('profile');
        if (!profileEl) return;

        profileEl.innerHTML = `
          <img src="${this.data.profile.avatar}" alt="Avatar">
          <div class="profile-text">
            <h1>${this.data.profile.name}</h1>
            <p>${this.data.profile.tagline}</p>
          </div>`;
    }



    // ============ PROJECTS ======
    private renderProjects(): void {
        const container = document.getElementById('projectList');
        if (!container) return;

        this.data.projects.forEach((project) => {
            const card = this.createProjectCard(project);
            container.appendChild(card);
        });
    }



    private createProjectCard(project: Project): HTMLElement {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
         <img class="thumbnail" src="${project.thumb}" alt="${project.title} thumbnail">
         <div class="card-content">
            <div class="card-header"><h3>${project.title}</h3></div>
            <p class="card-desc">${project.description}</p>
            <div class="project-links"></div>
          </div>`;

        const header = card.querySelector('.card-header')!;
        project.tags.forEach(tag => header.insertAdjacentHTML('beforeend', this.createTagElement(tag)));

        const linksContainer = card.querySelector('.project-links') as HTMLElement;
        this.renderProjectLinks(linksContainer, project.links);

        return card;
    }

    private createTagElement(tag: string): string {
        return `<span class="tag">${tag}</span>`;
    }

    private renderProjectLinks(container: HTMLElement, links: ProjectLink[]) {
        links.forEach(link => {
            container.insertAdjacentHTML(
                'beforeend',
                `<a href="${link.url}" target="_blank" rel="noopener">
                <i class="${link.icon}"></i>${link.label}
            </a>`
            );
        });
    }

    private renderSocialLinks(container: HTMLElement, links: ProjectLink[]) {
        links.forEach(link => {
            container.insertAdjacentHTML(
                'beforeend',
                `<a class="social-btn" href="${link.url}" target="_blank" rel="noopener">
                <i class="${link.icon}"></i>${link.label}
            </a>`
            );
        });
    }




    // ====== EXPERIENCE =======

    private renderExperience(): void {
        const container = document.getElementById('experienceList');
        if (!container) return;

        this.data.experience.forEach((exp) => {
            const card = document.createElement('div');
            card.className = 'card';

            const hasLogo = exp.logo && exp.logo.trim() !== '';

            const logoHTML = hasLogo
                ? `<img class="thumbnail" src="${exp.logo}" alt="${exp.role} logo">`
                : `<div class="text-logo">${this.escapeHtml(exp.company)}</div>`;

            card.innerHTML = `
            ${logoHTML}
            <div class="card-content">
                <div class="xp-title">
                  <strong class="xp-role">${exp.role}</strong>
                  <span class="xp-company">${exp.company}</span>
                  <span class="xp-duration">${exp.duration}</span>
                </div>
                <ul class="xp-list"></ul>
            </div>`;

            const ul = card.querySelector('.xp-list')!;
            exp.bullets.forEach((b) => {
                const li = document.createElement('li');
                if (b.includes(':')) {
                    const parts = b.split(/:(.+)/);
                    li.innerHTML = `<strong>${parts[0]}:</strong>${parts[1]}`;
                } else {
                    li.textContent = b;
                }
                ul.appendChild(li);
            });

            container.appendChild(card);
        });
    }

    private escapeHtml(text: string): string {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }


    private getInitials(companyName: string): string {
        return companyName
            .split(' ')
            .map(word => word.charAt(0))
            .join('')
            .toUpperCase();
    }




    // =============== EDUCATION ===========
    private renderEducation(): void {
        const container = document.getElementById('educationList');
        if (!container) return;

        this.data.education.forEach((edu) => {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
      <img class="thumbnail" src="${edu.logo}" alt="${edu.school} logo">
      <div class="card-content">
        <strong class="xp-role">${edu.degree}</strong>
        <span class="xp-company">${edu.school}</span>
        <span class="xp-duration">${edu.duration}</span>
      </div>`;
            container.appendChild(card);
        });
    }



    // ========= CONTACT =========
    private renderContact(): void {
        const container = document.getElementById('contactTerminal');
        if (!container) return;

        container.innerHTML = `
          <div class="term-header">
            <img class="term-avatar" src="${this.data.profile.avatar}" alt="avatar">
            <div class="term-bio"></div>
          </div>
          <p class="cli-line blink" id="cliLine"></p>
          <div class="social-list"></div>`;

        const bioDiv = container.querySelector('.term-bio')!;
        this.data.contact.bio.forEach(bio =>
            bioDiv.insertAdjacentHTML('beforeend', `<p><strong>${bio.cmd}</strong> &gt; ${bio.out}</p>`)
        );

        const socialDiv = container.querySelector('.social-list') as HTMLElement;
        this.renderSocialLinks(socialDiv, this.data.contact.socials);

        this.setupCliHover();
    }



    private setupCliHover(): void {
        const cli = document.getElementById('cliLine');
        if (!cli) return;

        const lines = this.data.contact.lines;           // 0 = email, 1-n = socials
        let typingTimeout: ReturnType<typeof setTimeout> | null = null;
        let cycleInterval: ReturnType<typeof setInterval> | null = null;
        let current = 0;                                 // start with email

        const typeLine = (text: string): void => {
            if (typingTimeout) clearTimeout(typingTimeout);
            let i = 0;
            cli.textContent = '';
            const step = () => {
                if (i < text.length) {
                    cli.textContent += text.charAt(i++);
                    typingTimeout = setTimeout(step, 25);
                }
            };
            step();
        };


        const startCycling = () => {
            if (cycleInterval) clearInterval(cycleInterval);
            cycleInterval = setInterval(() => {
                current = (current + 1) % lines.length;
                typeLine(lines[current]);
            }, 2500);
        };

        typeLine(lines[0]);
        startCycling();

        document.querySelectorAll('.social-btn').forEach((btn, idx) => {
            const lineIndex = idx;
            btn.addEventListener('mouseenter', () => {
                current = lineIndex;
                typeLine(lines[current]);
                startCycling();
            });
        });
    }


    private renderTagCollapse(): void {
        const MAX_SHOWN = 5;
        document.querySelectorAll('.card-header').forEach((header) => {
            const tags = Array.from(header.querySelectorAll('.tag')) as HTMLElement[];
            if (tags.length <= MAX_SHOWN) return;

            const moreTag = this.createMoreTag(tags.length - MAX_SHOWN);
            header.appendChild(moreTag);
            this.collapseTags(header, tags, moreTag, MAX_SHOWN);
        });
    }

    private createMoreTag(extraCount: number): HTMLElement {
        const span = document.createElement('span');
        span.className = 'tag more';
        span.textContent = `+${extraCount}`;
        span.style.cursor = 'pointer';
        return span;
    }



    private collapseTags(
        header: Element,
        tags: HTMLElement[],
        more: HTMLElement,
        maxShown: number
    ): void {
        let expanded = false;

        const showAllTags = () => {
            tags.forEach(tag => tag.style.display = 'inline-block');
            more.style.display = 'none';
            expanded = true;
        };

        const hideExtraTags = () => {
            tags.slice(maxShown).forEach(tag => tag.style.display = 'none');
            more.textContent = `+${tags.length - maxShown}`;
            more.style.display = 'inline-block';
            expanded = false;
        };

        //   initial collapse
        hideExtraTags();

        header.addEventListener('mouseenter', showAllTags);
        header.addEventListener('mouseleave', hideExtraTags);

        more.addEventListener('click', () => {
            expanded ? hideExtraTags() : showAllTags();
        });

        more.addEventListener('touchstart', (e) => {
            e.preventDefault(); // Prevent double events on mobile
            expanded ? hideExtraTags() : showAllTags();
        }, { passive: false });
    }




    // ======== FOOTER ==========
    private renderFooter(): void {
        const footer = document.getElementById('footer');
        if (footer) footer.textContent = this.data.footer;
    }
}

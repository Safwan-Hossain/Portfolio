export interface NavLink {
    label: string;
    href: string;
    external?: boolean;
}

export interface ProjectLink {
    icon: string;
    label: string;
    url: string;
}

export interface Project {
    title: string;
    thumb: string;
    description: string;
    tags: string[];
    links: ProjectLink[];
}

export interface Experience {
    role: string;
    company: string;
    duration: string;
    logo: string;
    bullets: string[];
}

export interface Education {
    school: string;
    degree: string;
    duration: string;
    logo: string;
}


export interface ContactBio {
    cmd: string;
    out: string;
}

export interface Contact {
    lines: string[];
    bio: ContactBio[];
    socials: ProjectLink[];
}

export interface Profile {
    name: string;
    tagline: string;
    avatar: string;
}

export interface PortfolioData {
    logo: string;
    nav: NavLink[];
    profile: Profile;
    projects: Project[];
    experience: Experience[];
    contact: Contact;
    footer: string;
    education: Education[];
}

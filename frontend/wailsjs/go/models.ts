export namespace types {
	
	export class ActivityEvent {
	    id: number;
	    activity_type: string;
	    actor: string;
	    ref: string;
	    // Go type: time
	    timestamp: any;
	
	    static createFrom(source: any = {}) {
	        return new ActivityEvent(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.activity_type = source["activity_type"];
	        this.actor = source["actor"];
	        this.ref = source["ref"];
	        this.timestamp = this.convertValues(source["timestamp"], null);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class Contributor {
	    login: string;
	    avatar_url: string;
	    contributions: number;
	    html_url: string;
	
	    static createFrom(source: any = {}) {
	        return new Contributor(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.login = source["login"];
	        this.avatar_url = source["avatar_url"];
	        this.contributions = source["contributions"];
	        this.html_url = source["html_url"];
	    }
	}
	export class ReleaseAsset {
	    name: string;
	    download_count: number;
	    size_bytes: number;
	    content_type: string;
	    browser_download_url: string;
	
	    static createFrom(source: any = {}) {
	        return new ReleaseAsset(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.name = source["name"];
	        this.download_count = source["download_count"];
	        this.size_bytes = source["size_bytes"];
	        this.content_type = source["content_type"];
	        this.browser_download_url = source["browser_download_url"];
	    }
	}
	export class Release {
	    tag_name: string;
	    name: string;
	    body: string;
	    // Go type: time
	    published_at: any;
	    // Go type: time
	    created_at: any;
	    assets: ReleaseAsset[];
	    total_downloads: number;
	    prerelease: boolean;
	    draft: boolean;
	    author: string;
	
	    static createFrom(source: any = {}) {
	        return new Release(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.tag_name = source["tag_name"];
	        this.name = source["name"];
	        this.body = source["body"];
	        this.published_at = this.convertValues(source["published_at"], null);
	        this.created_at = this.convertValues(source["created_at"], null);
	        this.assets = this.convertValues(source["assets"], ReleaseAsset);
	        this.total_downloads = source["total_downloads"];
	        this.prerelease = source["prerelease"];
	        this.draft = source["draft"];
	        this.author = source["author"];
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	
	export class Tag {
	    name: string;
	    commit_sha: string;
	    zipball_url: string;
	    tarball_url: string;
	
	    static createFrom(source: any = {}) {
	        return new Tag(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.name = source["name"];
	        this.commit_sha = source["commit_sha"];
	        this.zipball_url = source["zipball_url"];
	        this.tarball_url = source["tarball_url"];
	    }
	}
	export class RepoMeta {
	    full_name: string;
	    description: string;
	    stars: number;
	    forks: number;
	    watchers: number;
	    open_issues: number;
	    language: string;
	    license: string;
	    // Go type: time
	    created_at: any;
	    // Go type: time
	    updated_at: any;
	    // Go type: time
	    pushed_at: any;
	    html_url: string;
	    homepage: string;
	    topics: string[];
	    size_kb: number;
	    default_branch: string;
	    archived: boolean;
	    has_issues: boolean;
	    has_wiki: boolean;
	    has_discussions: boolean;
	    has_pages: boolean;
	    network_count: number;
	
	    static createFrom(source: any = {}) {
	        return new RepoMeta(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.full_name = source["full_name"];
	        this.description = source["description"];
	        this.stars = source["stars"];
	        this.forks = source["forks"];
	        this.watchers = source["watchers"];
	        this.open_issues = source["open_issues"];
	        this.language = source["language"];
	        this.license = source["license"];
	        this.created_at = this.convertValues(source["created_at"], null);
	        this.updated_at = this.convertValues(source["updated_at"], null);
	        this.pushed_at = this.convertValues(source["pushed_at"], null);
	        this.html_url = source["html_url"];
	        this.homepage = source["homepage"];
	        this.topics = source["topics"];
	        this.size_kb = source["size_kb"];
	        this.default_branch = source["default_branch"];
	        this.archived = source["archived"];
	        this.has_issues = source["has_issues"];
	        this.has_wiki = source["has_wiki"];
	        this.has_discussions = source["has_discussions"];
	        this.has_pages = source["has_pages"];
	        this.network_count = source["network_count"];
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class RepoBundle {
	    meta: RepoMeta;
	    contributors: Contributor[];
	    releases: Release[];
	    languages: Record<string, number>;
	    activity: ActivityEvent[];
	    branch_count: number;
	    tags: Tag[];
	    errors: Record<string, string>;
	    // Go type: time
	    cached_at: any;
	
	    static createFrom(source: any = {}) {
	        return new RepoBundle(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.meta = this.convertValues(source["meta"], RepoMeta);
	        this.contributors = this.convertValues(source["contributors"], Contributor);
	        this.releases = this.convertValues(source["releases"], Release);
	        this.languages = source["languages"];
	        this.activity = this.convertValues(source["activity"], ActivityEvent);
	        this.branch_count = source["branch_count"];
	        this.tags = this.convertValues(source["tags"], Tag);
	        this.errors = source["errors"];
	        this.cached_at = this.convertValues(source["cached_at"], null);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	

}


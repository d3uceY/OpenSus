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
	export class ContributorWeek {
	    w: number;
	    a: number;
	    d: number;
	    c: number;
	
	    static createFrom(source: any = {}) {
	        return new ContributorWeek(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.w = source["w"];
	        this.a = source["a"];
	        this.d = source["d"];
	        this.c = source["c"];
	    }
	}
	export class ContributorStats {
	    // Go type: struct { Login string "json:\"login\""; AvatarURL string "json:\"avatar_url\"" }
	    author: any;
	    total: number;
	    weeks: ContributorWeek[];
	
	    static createFrom(source: any = {}) {
	        return new ContributorStats(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.author = this.convertValues(source["author"], Object);
	        this.total = source["total"];
	        this.weeks = this.convertValues(source["weeks"], ContributorWeek);
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
	
	export class ReleaseAsset {
	    name: string;
	    download_count: number;
	
	    static createFrom(source: any = {}) {
	        return new ReleaseAsset(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.name = source["name"];
	        this.download_count = source["download_count"];
	    }
	}
	export class Release {
	    tag_name: string;
	    // Go type: time
	    published_at: any;
	    assets: ReleaseAsset[];
	    total_downloads: number;
	
	    static createFrom(source: any = {}) {
	        return new Release(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.tag_name = source["tag_name"];
	        this.published_at = this.convertValues(source["published_at"], null);
	        this.assets = this.convertValues(source["assets"], ReleaseAsset);
	        this.total_downloads = source["total_downloads"];
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
	
	    static createFrom(source: any = {}) {
	        return new Tag(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.name = source["name"];
	    }
	}
	export class WeeklyCommitActivity {
	    week: number;
	    total: number;
	    days: number[];
	
	    static createFrom(source: any = {}) {
	        return new WeeklyCommitActivity(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.week = source["week"];
	        this.total = source["total"];
	        this.days = source["days"];
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
	    pushed_at: any;
	    html_url: string;
	
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
	        this.pushed_at = this.convertValues(source["pushed_at"], null);
	        this.html_url = source["html_url"];
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
	    commit_activity: WeeklyCommitActivity[];
	    contrib_stats: ContributorStats[];
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
	        this.commit_activity = this.convertValues(source["commit_activity"], WeeklyCommitActivity);
	        this.contrib_stats = this.convertValues(source["contrib_stats"], ContributorStats);
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


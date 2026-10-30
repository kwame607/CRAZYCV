export interface SimPort {
  port: number;
  protocol: "tcp";
  state: "open" | "closed" | "filtered";
  service: string;
  explanation: string;
  falsePositiveNote: string;
  remediation: string;
}

export interface SimScenario {
  id: string;
  title: string;
  /** True when the data is transcribed from a real run of my own scanner rather than invented. */
  real?: boolean;
  /** Fictional scenarios use a documentation-range address (RFC 5737), never contacted. */
  target: string;
  description: string;
  ports: SimPort[];
}

const common = {
  protocol: "tcp" as const,
};

export const simScenarios: SimScenario[] = [
  {
    id: "my-scanner-scanme",
    title: "My scanner on scanme.nmap.org (a real run)",
    real: true,
    target: "scanme.nmap.org (45.33.32.156), a host published by the Nmap project for scanning practice",
    description:
      "The output my Python port scanner printed for ports 1 to 100 in common-ports mode, transcribed from a terminal capture. Seven ports were tried. The capture has no date.",
    ports: [
      { ...common, port: 20, state: "closed", service: "ftp-data", explanation: "The scanner printed 'close' for port 20, so a TCP connection to it did not complete.", falsePositiveNote: "My scanner prints 'close' for any failed connection, so a closed, filtered or timed-out port all look the same here.", remediation: "Nothing to fix on a practice host. On a system I own I would retry and check with a second tool before concluding anything." },
      { ...common, port: 21, state: "open", service: "ftp", explanation: "A TCP connection to port 21 completed. Port 21 is conventionally FTP.", falsePositiveNote: "Open only means the connection completed. I did not identify the service, and a port number is just a convention.", remediation: "On a system I own I would identify the service with a banner or version check, then decide whether it should be reachable at all." },
      { ...common, port: 22, state: "open", service: "ssh", explanation: "A TCP connection to port 22 completed. Port 22 is conventionally SSH.", falsePositiveNote: "Open only means the connection completed. I did not identify the service behind it.", remediation: "On a system I own I would confirm it is SSH, restrict who can reach it and prefer key-based logins." },
      { ...common, port: 23, state: "closed", service: "telnet", explanation: "The scanner printed 'close' for port 23, so a TCP connection to it did not complete.", falsePositiveNote: "Closed here may also mean filtered or timed out, because my scanner does not tell them apart.", remediation: "Nothing to fix. Telnet being unreachable is the safer outcome." },
      { ...common, port: 25, state: "closed", service: "smtp", explanation: "The scanner printed 'close' for port 25, so a TCP connection to it did not complete.", falsePositiveNote: "Closed here may also mean filtered or timed out, because my scanner does not tell them apart.", remediation: "Nothing to fix on a practice host." },
      { ...common, port: 53, state: "closed", service: "dns", explanation: "The scanner printed 'close' for port 53, so a TCP connection to it did not complete.", falsePositiveNote: "DNS also uses UDP, which my TCP-only scanner does not test, so this says nothing about DNS in general.", remediation: "Nothing to fix on a practice host." },
      { ...common, port: 80, state: "open", service: "http", explanation: "A TCP connection to port 80 completed. Port 80 is conventionally unencrypted HTTP.", falsePositiveNote: "Open only means the connection completed. I did not identify the web server or what it serves.", remediation: "On a system I own I would check whether it should redirect to HTTPS." },
    ],
  },
  {
    id: "small-web-server",
    title: "Small web server",
    target: "192.0.2.10 (RFC 5737 documentation address, never contacted)",
    description: "A fictional host that serves a website and accepts remote administration.",
    ports: [
      {
        ...common,
        port: 22,
        state: "open",
        service: "ssh",
        explanation:
          "A TCP handshake completed on port 22, which is conventionally used by SSH for remote administration.",
        falsePositiveNote:
          "Port numbers are conventions. Another service could listen here; a banner or protocol check is needed to confirm.",
        remediation:
          "Restrict SSH to trusted addresses, disable password logins in favor of keys, and keep the service patched.",
      },
      {
        ...common,
        port: 80,
        state: "open",
        service: "http",
        explanation: "Port 80 accepted a connection. It is conventionally unencrypted HTTP.",
        falsePositiveNote: "A load balancer or proxy in front of the host can answer for it.",
        remediation: "Redirect HTTP to HTTPS and send an HSTS header once HTTPS is verified.",
      },
      {
        ...common,
        port: 443,
        state: "open",
        service: "https",
        explanation: "Port 443 accepted a connection, conventionally HTTPS.",
        falsePositiveNote: "An open port says nothing about TLS quality. That needs a separate configuration review.",
        remediation: "Review the TLS configuration and certificate lifecycle.",
      },
      {
        ...common,
        port: 3306,
        state: "filtered",
        service: "mysql",
        explanation:
          "No response arrived. A firewall silently dropping packets looks like this, but so does packet loss.",
        falsePositiveNote:
          "Filtered is not the same as closed or secure. A retry from another vantage point may differ. Note: a simple connect-scanner that treats every failed connection as 'closed' (like my own Python scanner) cannot tell these apart.",
        remediation: "Keep databases off public interfaces; allow access only from application hosts.",
      },
      {
        ...common,
        port: 8080,
        state: "closed",
        service: "http-alt",
        explanation: "The host actively refused the connection (reset), so nothing is listening on this port.",
        falsePositiveNote: "A service may start later, and a firewall can forge resets.",
        remediation: "No action needed unless a service is expected here.",
      },
    ],
  },
  {
    id: "lab-database-host",
    title: "Lab database host",
    target: "198.51.100.20 (RFC 5737 documentation address, never contacted)",
    description: "A fictional host where a database is reachable more widely than intended.",
    ports: [
      {
        ...common,
        port: 22,
        state: "filtered",
        service: "ssh",
        explanation: "No response. Likely a firewall rule limiting SSH to certain sources.",
        falsePositiveNote: "From an allowed source the port may well be open.",
        remediation: "Confirm the allow-list matches who actually needs access.",
      },
      {
        ...common,
        port: 5432,
        state: "open",
        service: "postgresql",
        explanation: "A connection to the PostgreSQL default port succeeded from the scan source.",
        falsePositiveNote: "Reachability does not mean unauthenticated access; authentication was not tested.",
        remediation: "Bind to private interfaces, require TLS and strong authentication, and limit source addresses.",
      },
      {
        ...common,
        port: 6379,
        state: "closed",
        service: "redis",
        explanation: "Connection refused: nothing listening on the Redis default port.",
        falsePositiveNote: "Redis could be running on a non-default port, which this scan did not cover.",
        remediation: "No action needed for this port.",
      },
    ],
  },
];

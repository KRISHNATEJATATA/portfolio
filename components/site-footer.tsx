export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line">
      <div className="shell py-8 text-sm text-muted">
        <p>&copy; {year} Krishna Teja</p>
      </div>
    </footer>
  );
}

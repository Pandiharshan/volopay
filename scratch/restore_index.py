with open('../candidate/index.html', 'r', encoding='utf-8') as f:
    content = f.read()

banner = (
    '<div style="background: #0284c7; color: white; padding: 14px 24px; '
    'font-family: system-ui, sans-serif; font-size: 15px; font-weight: 600; '
    'display: flex; justify-content: space-between; align-items: center; '
    'border-bottom: 2px solid #0369a1; position: sticky; top: 0; z-index: 9999;">'
    '<span>📊 Assessment Product: <strong>Signal Desk — Revenue Intelligence Inbox</strong></span>'
    '<a href="app/index.html" style="background: #0f172a; color: white; padding: 8px 18px; '
    'border-radius: 6px; text-decoration: none; font-weight: 700;">Open Working Application →</a>'
    '</div>'
)

modified = content.replace('<body>', '<body>' + banner, 1)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(modified)

print('Restored root index.html with launch banner successfully!')

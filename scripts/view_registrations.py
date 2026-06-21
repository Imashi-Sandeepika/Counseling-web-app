import sqlite3
import pandas as pd
import os

def main():
    # Paths
    project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    db_path = os.path.join(project_root, 'backend', 'database', 'mental_health_v2.db')
    md_output_path = os.path.join(project_root, 'docs', 'registrations.md')

    if not os.path.exists(db_path):
        print(f"Database not found at: {db_path}")
        return

    # Connect to sqlite
    conn = sqlite3.connect(db_path)
    
    # 1. Fetch Users
    df_users = pd.read_sql_query("SELECT id, name, email, created_at, last_login FROM user", conn)
    # 2. Fetch Counselors
    df_counselors = pd.read_sql_query("SELECT id, name, email, specialty, experience, languages, country, created_at FROM counselor", conn)
    # 3. Fetch Admins
    df_admins = pd.read_sql_query("SELECT id, name, email, created_at FROM admin", conn)
    
    conn.close()

    # Generate Markdown content
    md_content = "# Platform Registration Details\n\n"
    md_content += f"This file shows the current registrations on the Counseling platform. Run the script `python scripts/view_registrations.py` to refresh this file dynamically as new users register.\n\n"
    
    md_content += "## 👥 Registered Users\n\n"
    if not df_users.empty:
        md_content += df_users.to_markdown(index=False) + "\n\n"
    else:
        md_content += "*No registered users.*\n\n"
        
    md_content += "## 👨‍⚕️ Registered Counselors\n\n"
    if not df_counselors.empty:
        md_content += df_counselors.to_markdown(index=False) + "\n\n"
    else:
        md_content += "*No registered counselors.*\n\n"
        
    md_content += "## 👑 Registered Administrators\n\n"
    if not df_admins.empty:
        md_content += df_admins.to_markdown(index=False) + "\n\n"
    else:
        md_content += "*No registered administrators.*\n\n"

    # Write markdown
    with open(md_output_path, 'w', encoding='utf-8') as f:
        f.write(md_content)

    # Print to console
    pd.set_option('display.max_columns', None)
    pd.set_option('display.width', 1000)
    
    print("\n" + "="*50)
    print("           REGISTERED USER ACCOUNTS")
    print("="*50)
    print(df_users.to_string(index=False) if not df_users.empty else "No users found.")
    
    print("\n" + "="*50)
    print("           REGISTERED COUNSELOR ACCOUNTS")
    print("="*50)
    print(df_counselors.to_string(index=False) if not df_counselors.empty else "No counselors found.")
    
    print("\n" + "="*50)
    print("           REGISTERED ADMIN ACCOUNTS")
    print("="*50)
    print(df_admins.to_string(index=False) if not df_admins.empty else "No admins found.")
    print("\n" + "="*50)
    print(f"Markdown file successfully generated at: docs/registrations.md")
    print("="*50 + "\n")

if __name__ == '__main__':
    main()

import urllib.request
import urllib.parse
import re

queries = [
    "white marble texture unsplash",
    "grey stone texture unsplash",
    "tile texture unsplash"
]

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36'
}

for q in queries:
    encoded_q = urllib.parse.quote(q)
    url = f"https://www.bing.com/search?q={encoded_q}"
    print(f"\nSearching for: {q}")
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req) as response:
            html = response.read().decode('utf-8')
            
            # Print any link containing unsplash.com/photos
            links = re.findall(r'unsplash\.com/photos/([a-zA-Z0-9\-]+)', html)
            unique_links = list(dict.fromkeys(links))
            print(f"Found {len(unique_links)} Unsplash photo IDs:")
            for l in unique_links[:10]:
                print(f"  {l}")
    except Exception as e:
        print(f"Error: {e}")

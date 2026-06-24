import urllib.request

urls = [
    "https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQFP-SSnYN2rhQ9fx-mFxAiLAN1qOq8XaM676fXpLRtKMpmLdzaFDnM4-v1qK6F4xuwf-87cebwSsZ04_11oDW0mIX0jVSzwhYzvkgjjH5VedzsDrT0BIbOr2cK8Eb21hXyNIHvBnu2c-aFJSfdNUl8ThKjkazRs0vZS4pRQ2w=="
]

class NoRedirectHandler(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        print(f"Code {code} -> Redirects to: {newurl}")
        return None

opener = urllib.request.build_opener(NoRedirectHandler)

for url in urls:
    print(f"\nResolving {url[:60]}...")
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        opener.open(req)
    except Exception as e:
        pass

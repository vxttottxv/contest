#!/usr/bin/env python3
"""
LUXE Boutique - Auth Portal Backend API Server (Python 3)
Supports Login, Registration, Email Duplication Check, Password Reset, and Static File Serving.
"""

import http.server
import socketserver
import json
import os
import re
import time

PORT = 8080
PUBLIC_DIR = os.path.join(os.path.dirname(__file__), 'public')

# In-memory Database Simulation with initial demo users
registered_users = [
    {
        "id": 1,
        "email": "admin@luxe.com",
        "password": "admin123!",
        "name": "LUXE 관리자",
        "phone": "010-1234-5678",
        "role": "VIP Administrator",
        "address": "[06164] 서울 강남구 테헤란로 123 LUXE 타워 15층",
        "gender": "male",
        "createdAt": "2026-01-01T00:00:00.000Z"
    },
    {
        "id": 2,
        "email": "user@example.com",
        "password": "user123!",
        "name": "홍길동",
        "phone": "010-9876-5432",
        "role": "Gold Member",
        "address": "[04524] 서울 중구 세종대로 110",
        "gender": "male",
        "createdAt": "2026-02-15T00:00:00.000Z"
    }
]

class ShoppingMallRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=PUBLIC_DIR, **kwargs)

    def _send_json_response(self, status_code, data):
        self.send_response(status_code)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.end_headers()
        self.wfile.write(json.dumps(data, ensure_ascii=False).encode('utf-8'))

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.end_headers()

    def do_POST(self):
        content_length = int(self.headers.get('Content-Length', 0))
        post_data = self.rfile.read(content_length)
        
        try:
            body = json.loads(post_data.decode('utf-8')) if post_data else {}
        except Exception:
            return self._send_json_response(400, {"success": False, "message": "잘못된 JSON 요청 형식입니다."})

        # API Router
        if self.path == '/api/check-email':
            return self.handle_check_email(body)
        elif self.path == '/api/register':
            return self.handle_register(body)
        elif self.path == '/api/login':
            return self.handle_login(body)
        elif self.path == '/api/find-password':
            return self.handle_find_password(body)
        else:
            return self._send_json_response(404, {"success": False, "message": "API 엔드포인트를 찾을 수 없습니다."})

    def handle_check_email(self, body):
        email = body.get('email', '').strip()
        if not email:
            return self._send_json_response(400, {"success": False, "message": "이메일을 입력해 주세요."})
        
        email_regex = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        if not re.match(email_regex, email):
            return self._send_json_response(400, {"success": False, "message": "올바른 이메일 형식이 아닙니다."})

        is_duplicate = any(u['email'].lower() == email.lower() for u in registered_users)
        if is_duplicate:
            return self._send_json_response(200, {
                "success": False, 
                "available": False, 
                "message": "이미 사용 중인 이메일입니다."
            })
        else:
            return self._send_json_response(200, {
                "success": True, 
                "available": True, 
                "message": "사용 가능한 이메일입니다."
            })

    def handle_register(self, body):
        email = body.get('email', '').strip()
        password = body.get('password', '')
        name = body.get('name', '').strip()
        phone = body.get('phone', '').strip()
        zipcode = body.get('zipcode', '')
        address = body.get('address', '')
        detail_address = body.get('detailAddress', '')
        gender = body.get('gender', 'none')
        birthdate = body.get('birthdate', '')
        agreements = body.get('agreements', {})

        if not email or not password or not name or not phone:
            return self._send_json_response(400, {"success": False, "message": "필수 입력 항목이 누락되었습니다."})

        if len(password) < 8:
            return self._send_json_response(400, {"success": False, "message": "비밀번호는 8자 이상이어야 합니다."})

        if any(u['email'].lower() == email.lower() for u in registered_users):
            return self._send_json_response(400, {"success": False, "message": "이미 가입된 이메일 계정입니다."})

        # Register User
        full_address = f"[{zipcode}] {address} {detail_address}".strip() if zipcode and address else "주소 미입력"
        new_user = {
            "id": len(registered_users) + 1,
            "email": email,
            "password": password,
            "name": name,
            "phone": phone,
            "role": "Regular Member",
            "address": full_address,
            "gender": gender,
            "birthdate": birthdate,
            "marketingAgree": agreements.get('marketing', False),
            "createdAt": time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime())
        }
        registered_users.append(new_user)

        print(f"[SERVER] Registered new user: {new_user['email']}")

        return self._send_json_response(201, {
            "success": True,
            "message": f"{name}님, LUXE 회원가입이 성공적으로 완료되었습니다!",
            "user": {
                "id": new_user["id"],
                "email": new_user["email"],
                "name": new_user["name"],
                "phone": new_user["phone"],
                "role": new_user["role"],
                "address": new_user["address"],
                "createdAt": new_user["createdAt"]
            }
        })

    def handle_login(self, body):
        email = body.get('email', '').strip()
        password = body.get('password', '')

        if not email or not password:
            return self._send_json_response(400, {"success": False, "message": "이메일과 비밀번호를 입력해 주세요."})

        user = next((u for u in registered_users if u['email'].lower() == email.lower()), None)
        if not user:
            return self._send_json_response(401, {"success": False, "message": "가입되지 않은 이메일 주소입니다."})

        if user['password'] != password:
            return self._send_json_response(401, {"success": False, "message": "비밀번호가 일치하지 않습니다."})

        print(f"[SERVER] User logged in: {user['email']}")

        return self._send_json_response(200, {
            "success": True,
            "message": f"{user['name']}님, 환영합니다!",
            "token": f"luxe_token_{int(time.time())}_{user['id']}",
            "user": {
                "id": user["id"],
                "email": user["email"],
                "name": user["name"],
                "phone": user["phone"],
                "role": user.get("role", "Member"),
                "address": user.get("address", "주소 없음"),
                "createdAt": user.get("createdAt", "")
            }
        })

    def handle_find_password(self, body):
        email = body.get('email', '').strip()
        if not email:
            return self._send_json_response(400, {"success": False, "message": "이메일 주소를 입력해 주세요."})

        user = next((u for u in registered_users if u['email'].lower() == email.lower()), None)
        if not user:
            return self._send_json_response(404, {"success": False, "message": "해당 이메일로 등록된 회원 정보가 없습니다."})

        return self._send_json_response(200, {
            "success": True,
            "message": f"{email} 주소로 비밀번호 재설정 안내 메일을 발송했습니다."
        })

if __name__ == '__main__':
    print(f"==================================================")
    print(f" LUXE Auth Server running at:")
    print(f" http://localhost:{PORT}")
    print(f"==================================================")
    with socketserver.TCPServer(("", PORT), ShoppingMallRequestHandler) as httpd:
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nServer stopped.")

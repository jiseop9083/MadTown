### 📁 MadTown

![madtown_main](https://github.com/jiseop9083/madcamp_week4/assets/64767436/aa9af757-92a5-40cc-87cb-81c4b6c97934)

**MadTown**은 화상 회의, 칠판 및 화면 공유, 그리고 가위바위보 게임을 통해 사용자들을 색다른 경험으로 이끄는 원격 회의 플랫폼입니다!

**몰입캠프의 인연**을 여기서 끝내기 아쉽다는 생각에 만들게 된 **MadTown**입니다! 본 프로젝트를 통해 원격으로 만나서 회의를 하거나 몰입캠프에서 즐겨하던 게임인 가위바위보 미니게임을 넣어 몰입캠프의 추억을 잊지 않도록 제작하였습니다.

### 👭 Team

**신지섭** (Hanyang University 20)

**윤서희** (Sookmyung Women’s University 21)

### 🛠️ Stack

- [Phaser3](https://github.com/photonstorm/phaser) - Game engine
- [Colyseus](https://github.com/colyseus/colyseus) - WebSocket-based server framework
- Vanilla [TypeScript](https://github.com/microsoft/TypeScript)  - for both client and server sides
- Pixel art - 찍었습니다

## 💻 Service

### 1️⃣ Intro

- 캐릭터 선택을 하고, player name을 작성합니다.
    - 캐릭터 종류
  
        ![character1](https://github.com/jiseop9083/madcamp_week4/assets/64767436/ee288df4-d480-4c4a-b199-4da2a7ec01b9)

        ![character2](https://github.com/jiseop9083/madcamp_week4/assets/64767436/931524a0-0c87-4603-84f6-ec78043de3de)

        ![character3](https://github.com/jiseop9083/madcamp_week4/assets/64767436/3f5c7b73-c149-4627-a811-fe5384169ed6)

        
- player name을 작성하지 않고 `Welcome` 버튼을 누를 경우 alert 창으로 입력을 요청합니다.
- player name은 계속 저장되어 player가 접속할 경우 player 위에 이름을 뜨게 하여 player 간 구별을 가능하게 합니다.
- 입장하고, 방향키를 눌러 player 이동이 가능합니다.
    
  ![1](https://github.com/jiseop9083/madcamp_week4/assets/64767436/6f9152c2-7cca-417f-aac6-c47d674984c1)

    

### 2️⃣ Main : Chatting

- 가까운 거리(100px 이하)에서만 여러 명과 채팅이 가능합니다.
- 키보드에서 `Enter`를 누르거나 `send` 버튼을 누를 경우 가까이 있는 모든 player들에게 전송이 됩니다.
- 내 채팅은 채팅창 오른쪽에서, 다른 player들의 채팅은 왼쪽에서 확인 가능합니다.

![2](https://github.com/jiseop9083/madcamp_week4/assets/64767436/ecd99779-08eb-4766-88a7-89862c0c060b)

![3](https://github.com/jiseop9083/madcamp_week4/assets/64767436/59295dbc-3643-4575-99a7-329d2763c3d2)


### 3️⃣ Main : Video Conference

📌 한 room에 **두 player**만 참여가 가능합니다. 

1. **접속 및 방 생성:**
    - 사용자가 특정 room name을 입력하면, WebRTC를 이용하여 새로운 방을 생성합니다.
    - 방이 생성되면 해당 room에 대한 고유한 식별자를 생성하고, 이를 player에게 반환합니다.
2. **화상 회의 참여:**
    - 다른 사용자가 동일한 room name을 입력하면, 시스템은 해당 방에 참여하도록 허용합니다.
    - WebRTC를 활용하여 참여한 사용자 간에 실시간 비디오 및 오디오 스트림을 전송하고 수신할 수 있습니다.
3. **시그널링 서버:**
    - WebRTC는 통신 시작, 종료 및 중요 이벤트를 처리하기 위해 시그널링 서버를 사용합니다.
    - 시그널링 서버는 방 정보 및 연결 설정을 중개하여 사용자 간의 통신을 도와줍니다.
4. **ICE(Interactive Connectivity Establishment) 프레임워크:**
    - ICE 프레임워크를 사용하여 두 peer (player) 간에 최적의 연결 경로를 찾아 통신을 가능하게 합니다.

### 4️⃣ Main : Blackboard

- `Blackboard`버튼을 누르거나 칠판 근처에서 `R키`를 누르면, 해당 버튼을 누른 사람들끼리 실시간으로 칠판을 공유할 수 있습니다.
- 빨간색, 흰색, 노란색 분필 선택 후 선택된 색깔로 칠판에 그릴 수 있습니다.
- 칠판 정리 버튼을 통해 칠판을 다 지울 수 있습니다.
    
   ![5](https://github.com/jiseop9083/madcamp_week4/assets/64767436/5d7bc626-8b6b-44d0-a52e-1974f76ad408)

    

### 5️⃣ Main : Screen Share

📌  한 room에 **두 player**만 참여가 가능합니다. 

Video Conference와 마찬가지의 방식으로 WebRTC를 이용합니다. 

1. **접속 및 방 생성:**
    - `Screen Share`버튼을 누르거나 컴퓨터 근처에서 `R키`를 누르면, 해당 버튼을 누른 사람들끼리 실시간으로 화면을 공유할 수 있습니다.
    - 사용자가 특정 room name을 입력하면, WebRTC를 이용하여 새로운 방을 생성합니다.
    - 방이 생성되면 해당 room에 대한 고유한 식별자를 생성하고, 이를 player에게 반환합니다.
2. **화상 회의 참여:**
    - 다른 사용자가 동일한 room name을 입력하면, 시스템은 해당 방에 참여하도록 허용합니다.
    - WebRTC를 이용하여 player의 화면을 스트리밍하고, 다른 player들은 이를 실시간으로 확인할 수 있습니다.
3. **시그널링 서버:**
    - WebRTC는 통신 시작, 종료 및 중요 이벤트를 처리하기 위해 시그널링 서버를 사용합니다.
4. **ICE(Interactive Connectivity Establishment) 프레임워크:**
    - ICE 프레임워크를 사용하여 두 peer (player) 간에 최적의 연결 경로를 찾아 통신을 가능하게 합니다.
  
      
![6](https://github.com/jiseop9083/madcamp_week4/assets/64767436/40c5a569-f447-4d50-9e28-6af753c05ba9)


### 6️⃣ Main : Rock Paper Scissors Game

- `Start` 버튼을 누르거나 자판기 근처에서 `R키`를 누른 경우, 3초의 카운트 다운이 시작됩니다.
- 한 명이라도 가위바위보 버튼을 선택하지 않을 경우 player name과 `please choose`라는 문구가 함께 나오며 게임이 진행이 되지 않습니다.
- 가위바위보에 이길 경우 player 이름이 노란색으로 나옵니다.
- 3명 이상이 가위바위보를 하고, 한 명이 이길 경우 이긴 사람을 제외하고 가위바위보를 진행합니다.
- 최대 8명의 player가 참여할 수 있습니다.

![7](https://github.com/jiseop9083/madcamp_week4/assets/64767436/80d1c544-5138-4ea2-b9be-608fbf52e227)

![8](https://github.com/jiseop9083/madcamp_week4/assets/64767436/3bf804df-2743-40a3-8427-03a94e6a80db)


### ➡️ etc

- Welcome 버튼을 누름과 동시에 background music 재생됩니다.
- 키보드에서 `E`를 클릭할 경우 player가 의자에 앉습니다.
- 책상과 player간의 물리 충돌을 구현하였습니다.

![4](https://github.com/jiseop9083/madcamp_week4/assets/64767436/b6e3d76f-1818-4fb5-a92b-2c16301f14c8)


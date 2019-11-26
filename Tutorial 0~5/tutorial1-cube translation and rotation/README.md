# 컴퓨터그래픽스 최종 프로젝트


#### 201620955 소프트웨어학과 원정연

<br>

## Topic
#### After-image of rotating cube(회전하는 큐브의 잔상 표현)

![demo](http://git.ajou.ac.kr/WJY/webgl_project/raw/master/readme_image/demo.gif)

계속적으로 움직이는 물체에 대해서, openGL(webGL)에서는 1개의 frame마다 canvas에 draw를 해준다. 
이를 이용하여 큐브가 회전할 때 잔상이 남도록 이전 혹은 더 이전 frame들을 저장하였다. 

가장 최근에 저장된 것부터 가장 오래 전 것까지 각각의 큐브를 draw해주는 동안 점점 색이 옅어지도록 해서 수십개의 큐브 그림이 마치 잔상이 남는 것처럼 보이도록 표현해주었다.

<br>

### 기능
1. Translation
2. Rotation
3. After-image

<br>

#### Translation

![translation](http://git.ajou.ac.kr/WJY/webgl_project/raw/master/readme_image/translation.JPG)

수업시간에 배운 translation을 더 세세하기 컨트롤할 수 있도록 버튼을 추가하였다.
translation에서는 X, Y, Z 좌표를 (+) 방향뿐만 아니라 - 방향으로도 움직일 수 있도록 하였다.

또한 얼만큼 움직였는지 알 수 있도록 p tag의 content로 표시해주었다.

<br>

#### Rotation

![rotation](http://git.ajou.ac.kr/WJY/webgl_project/raw/master/readme_image/rotation.JPG)

단순히 rotation 속도를 증가하고, 멈추는 것뿐만 아니라 속도를 감소시키는 기능으로 반대로 회전도 가능하도록 하였다.

또한 회전 축을 원하는 대로 설정할 수 있으며 체크박스를 클릭하는 즉시 회전하는 축이 바뀐다.

<br>

#### After-image

![After-image](http://git.ajou.ac.kr/WJY/webgl_project/raw/master/readme_image/afterimage.JPG)

frame이 지날 때마다 그때의 큐브의 위치 정보를 배열에 저장한다. 
새로운 frame이 rendering되면 이때도 마찬가지로 큐브의 위치 정보를 저장하며, 이전까지 저장된 큐브의 위치정보 배열을 가지고 마치 잔상이 남는 것처럼 표현해주었다.
original 큐브 및 각 잔상들이 그려질 때마다 vertex buffer에 data를 새로 넣어주었는데, 이때 color의 a값이 점점 감소하도록 하였다.

이런 방식을 이용해서 잔상을 표현해주었는데, 사용자가 직접 잔상으로 남길 큐브의 개수와 잔상을 표현할 frame의 빈도를 설정해줄 수 있다. 
또한 잔상의 색깔을 원래 큐브 색, 흰색, 회색 중 선택할 수 있도록 하였다.


<br><br>

### Reference
#### HTML Tab
https://www.w3schools.com/howto/howto_js_tabs.asp

#### After image
https://threejs.org/examples/webgl_postprocessing_afterimage.html

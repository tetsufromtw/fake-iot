# IoT device

## この装置は以下のJSONフォーマットのデータを送信する(MQTTで)

```json
{
  "angle": 角度 (float),
  "rpm": 回転数 (float),
  "timestamp": タイムスタンプ (float, 秒単位のUNIX時間)
}
```
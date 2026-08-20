RB uses a struct named "released" to control items / musics unlocking or distribute prizes. Its struct is like:
```typescript
type ReleasedInfo = {
    type: number
    id: number
    param: number    // flag of whether unlock or not
}
```

Here are something I have investigated of what `type` numbers are stand for:

| **Released info `type`** | **REFLEC BEAT** | **limelight** | **colette** | **groovin'!!** | **VOLZZA** | **悠久のリフレシア** |
| --- | --- | --- | --- | --- | --- | --- | 
|  0 | musics | musics | musics | musics | musics | musics |
|  1 | hit sounds | hit sounds | hit sounds | hit sounds | hit sounds | hit sounds | 
|  2 | music select BGM | music select BGM | music select BGM | music select BGM | music select BGM |
|  3 | play area decoration (frame) | frame | frame | frame | frame | frame |
|  4 | explode effects | explode effects | explode effects | explode effects | explode effects | explode effects |
|  5 | play area background image (bg) | bg | bg | bg | bg | bg |
|  6 | - | player icons | player icons | player icons | player icons | character cards |
|  7 | - | byword left part | byword | byword | byword | byword |
|  8 | - | byword right part | _\<unknown\>_ | _\<unknown\>_ | voice chat sets | _\<unknown\>_ |
|  9 | - | - | _\<unknown\>_ | _\<unknown\>_ | - | Pastel-kun's equips (head) |
| 10 | - | - | seeds for Pastel Garden | _\<unknown\>_ | - | Pastel-kun's equips (body) |
| 11 | - | - | - | _\<unknown\>_ | - | Pastel-kun's equips (leg) |
| 12 | - | - | - | _\<unknown\>_ | - | Pastel-kun's equips (arms) |
| 13 | - | - | - | bonus Refle | - | Music fragments |
| 14 | - | - | - | examination tickets | - | - |

#### About bonus Refle (RB groovin'!!)
You can specify amount of bonus Refle by the `param` field.

#### About examination tickets (RB groovin'!!)
Many examinations of REFLEC DOJO can only be accessed when you have a ticket. Here listed the correspondence of `id` and examinations:
| **`id`** | **Examination** |
| --- | --- |
| 0 | BPM変化検定 / Examination "BPM Change" |
| 1 | アニメ検定 / Examination "Anime" |
| 2 | アツい検定 / Examination "Hot" |
| 3 | ひなビタ♪検定 / Examination "HinaBitter♪" |

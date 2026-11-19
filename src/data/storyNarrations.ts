import { LanguageCode } from '../types';

export interface LanguageOption {
  code: LanguageCode;
  label: string;
  nativeLabel: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en-IN', label: 'English', nativeLabel: 'English (IN)' },
  { code: 'hi-IN', label: 'Hindi', nativeLabel: 'हिन्दी' },
  { code: 'gu-IN', label: 'Gujarati', nativeLabel: 'ગુજરાતી' },
  { code: 'mr-IN', label: 'Marathi', nativeLabel: 'मराठी' },
  { code: 'ta-IN', label: 'Tamil', nativeLabel: 'தமிழ்' },
  { code: 'te-IN', label: 'Telugu', nativeLabel: 'తెలుగు' },
  { code: 'bn-IN', label: 'Bengali', nativeLabel: 'বাংলা' },
];

export interface LocalizedNarration {
  title: string;
  paragraphs: string[];
  moral: string;
}

export const STORY_NARRATIONS: Record<string, Partial<Record<LanguageCode, LocalizedNarration>>> = {
  'story-krishna-butter': {
    'en-IN': {
      title: 'Krishna and the Sweet Butter',
      paragraphs: [
        'In the sunlit village of Gokul, little Krishna woke up early with a joyful giggle. Above the courtyard shelf hung an earthen pot of freshly churned white butter.',
        'Krishna called his friends softly. Holding hands and climbing gently together, they shared every spoonful of butter—even leaving a treat for the courtyard monkeys.',
        'When Mother Yashoda peeked inside, Krishna smiled brightly. Sharing joy with friends makes every small treasure taste twice as sweet.',
      ],
      moral: 'Playfulness shines brightest when we share with friends.',
    },
    'hi-IN': {
      title: 'नटखट कान्हा और माखन की मटकी',
      paragraphs: [
        'गोकुल की सुनहरी सुबह में नन्हे कृष्ण मुस्कुराते हुए उठे। आँगन में ऊपर ताज़े सफ़ेद माखन की मटकी लटकी हुई थी।',
        'कान्हा ने अपने सभी मित्रों को प्यार से बुलाया। सबने मिलकर माखन बाँटा और आँगन के बंदरों को भी खिलाया।',
        'मैया यशोदा ने जब यह स्नेह देखा, तो वह मुस्कुरा उठीं। मित्रों के साथ बाँटी हुई ख़ुशी दोगुनी हो जाती है।',
      ],
      moral: 'मित्रों के साथ बाँटने से हर ख़ुशी बढ़ जाती है।',
    },
    'gu-IN': {
      title: 'કૃષ્ણ અને મધુર માખણની મટુકી',
      paragraphs: [
        'ગોકુળની સુંદર સવારે નાના કૃષ્ણ હસતાં હસતાં જાગ્યા. આંગણામાં તાજા સફેદ માખણની મટુકી લટકતી હતી.',
        'કાન્હાએ પોતાના બધા મિત્રોને પ્રેમથી બોલાવ્યા અને સૌએ મળીને માખણ વહેંચીને ખાધું.',
        'યશોદા મૈયાએ આ પ્રેમ જોઈને સ્મિત કર્યું. મિત્રો સાથે વહેંચવાથી આનંદ બમણો થાય છે.',
      ],
      moral: 'મિત્રો સાથે વહેંચવાથી દરેક ખુશી વધુ મીઠી બને છે.',
    },
    'mr-IN': {
      title: 'बाळकृष्ण आणि लोण्याची मटकी',
      paragraphs: [
        'गोकुळच्या सुंदर सकाळी बाळकृष्ण आनंदाने जागे झाले. अंगणात वर ताज्या लोण्याची मटकी टांगलेली होती.',
        'कान्हाने आपल्या सर्व सवंगड्यांना प्रेमाने बोलावले आणि सर्वांनी मिळून लोण्याचा आस्वाद घेतला.',
        'यशोदा मातेने हे पाहून गोड स्मित केले. मित्रांसोबत वाटून घेतलेला आनंद नेहमीच मोठा असतो.',
      ],
      moral: 'मित्रांसोबत वाटून घेतल्याने आनंद दुप्पट होतो.',
    },
    'ta-IN': {
      title: 'கண்ணனும் சுவையான வெண்ணெய் பானையும்',
      paragraphs: [
        'கோகுலத்தின் இனிய காலையில் குட்டி கண்ணன் புன்னகையுடன் எழுந்தார். முற்றத்தில் புதிய வெண்ணெய் பானை தொங்கிக் கொண்டிருந்தது.',
        'கண்ணன் தன் நண்பர்களை அன்போடு அழைத்தார். அனைவரும் ஒன்றாகச் சேர்ந்து வெண்ணெயைப் பகிர்ந்து மகிழ்ந்தனர்.',
        'அன்னை யசோதை இதைப் பார்த்து அன்புடன் சிரித்தார். நண்பர்களுடன் பகிர்ந்து கொள்வது மகிழ்ச்சியை இரட்டிப்பாக்கும்.',
      ],
      moral: 'நண்பர்களுடன் பகிர்ந்து கொள்ளும்போது மகிழ்ச்சி இரட்டிப்பாகும்.',
    },
    'te-IN': {
      title: 'చిన్ని కృష్ణుడు మరియు వెన్న కుండ',
      paragraphs: [
        'గోకులంలోని ఆహ్లాదకరమైన ఉదయం చిన్ని కృష్ణుడు చిరునవ్వుతో నిద్రలేచాడు. ముంగిట్లో తాజా వెన్న కుండ వేలాడుతూ ఉంది.',
        'కృష్ణుడు తన స్నేహితులందరినీ పిలిచి, అందరితో కలిసి ప్రేమగా వెన్నను పంచుకున్నాడు.',
        'యశోదామాత ఆ దృశ్యాన్ని చూసి మురిసిపోయింది. స్నేహితులతో పంచుకుంటే ఆనందం రెట్టింపు అవుతుంది.',
      ],
      moral: 'స్నేహితులతో పంచుకుంటే ఏ ఆనందమైనా రెట్టింపు అవుతుంది.',
    },
    'bn-IN': {
      title: 'শ্রীকৃষ্ণ এবং মাখনের হাঁড়ি',
      paragraphs: [
        'গোকুলের মিষ্টি সকালে ছোট্ট কৃষ্ণ হাসিমুখে জেগে উঠল। উঠোনের ওপর ঝুলছিল তাজা সাদা মাখনের হাঁড়ি।',
        'কৃষ্ণ তার সব বন্ধুদের ডেকে আনল এবং সবার সাথে মিলেমিশে আনন্দে মাখন ভাগ করে খেল।',
        'মা যশোদা এই ভালোবাসা দেখে মৃদু হাসলেন। বন্ধুদের সাথে ভাগ করে নিলে আনন্দ দ্বিগুণ হয়ে যায়।',
      ],
      moral: 'বন্ধুদের সাথে ভাগ করে নিলে প্রতিটি আনন্দ আরও মধুর হয়।',
    },
  },
  'story-krishna-sudama': {
    'en-IN': {
      title: 'Krishna and Sudama',
      paragraphs: [
        'Years after childhood school days, humble Sudama walked many miles to Dwarka carrying only a small cloth bundle of roasted rice.',
        'The moment Krishna saw his old friend at the palace gate, he ran barefoot to hug Sudama warmly and treated him with deep respect.',
        'True friendship never measures gifts by gold or size—it remembers kindness from the heart.',
      ],
      moral: 'True friendship values kindness and warmth above everything.',
    },
    'hi-IN': {
      title: 'कृष्ण और सुदामा की मित्रता',
      paragraphs: [
        'बचपन के मित्र सुदामा मीलों चलकर द्वारका पहुँचे। उनके पास भेंट में केवल थोड़े से भुने हुए चावल थे।',
        'जैसे ही कृष्ण ने द्वार पर अपने मित्र को देखा, वह नंगे पाँव दौड़ पड़े और सुदामा को गले लगा लिया।',
        'सच्ची मित्रता कभी धन नहीं देखती, वह हमेशा दिल के स्नेह को पहचानती है।',
      ],
      moral: 'सच्ची मित्रता हमेशा प्रेम और सम्मान पर टिकी होती है।',
    },
  },
  'story-ganesha-world': {
    'en-IN': {
      title: "Ganesha's Race Around the World",
      paragraphs: [
        'One sunny morning on Mount Kailash, Kartikeya and little Ganesha were challenged to circle the entire wide world first.',
        'While Kartikeya soared swiftly over oceans on his peacock, Ganesha smiled calmly and walked a gentle circle around his loving parents, Shiva and Parvati.',
        '"My whole world lives right here with the family who loves and guides me," Ganesha said softly.',
      ],
      moral: 'Wisdom is recognizing what truly matters in our hearts.',
    },
    'hi-IN': {
      title: 'गणेश जी की अनोखी परिक्रमा',
      paragraphs: [
        'कैलाश पर्वत पर कार्तिकेय और नन्हे गणेश को पूरी पृथ्वी की परिक्रमा करने की चुनौती मिली।',
        'कार्तिकेय अपने मोर पर तेज़ी से उड़ चले, पर गणेश जी ने शांत भाव से अपने माता-पिता शिव और पार्वती की परिक्रमा की।',
        'गणेश जी ने मुस्कुराकर कहा, "मेरा पूरा संसार तो मेरे माता-पिता में ही बसता है।"',
      ],
      moral: 'सच्ची बुद्धि अपनों के प्रति प्रेम और सम्मान को समझने में है।',
    },
  },
  'story-hanuman-leap': {
    'en-IN': {
      title: "Hanuman's Great Leap",
      paragraphs: [
        'Standing before the vast shimmering ocean, everyone wondered who could carry a message of hope all the way to the distant island.',
        'Gentle Jambavan reminded Hanuman of his quiet inner strength. Taking a deep, steady breath, Hanuman grew confident and calm.',
        'With one courageous leap over the waves, Hanuman proved that believing in yourself helps you overcome even the widest sea.',
      ],
      moral: 'Courage begins when we take a calm breath and believe in our strength.',
    },
    'hi-IN': {
      title: 'हनुमान जी की महाछलाँग',
      paragraphs: [
        'विशाल सागर के किनारे खड़े होकर सभी सोच रहे थे कि उस पार आशा का संदेश कौन ले जाएगा।',
        'जामवंत जी ने हनुमान को उनकी शांत आंतरिक शक्ति की याद दिलाई। गहरी साँस लेकर हनुमान जी आत्मविश्वास से भर गए।',
        'एक साहसी छलाँग में उन्होंने सागर पार कर दिखाया कि आत्मविश्वास से हर कठिन राह आसान हो जाती है।',
      ],
      moral: 'जब हम स्वयं पर विश्वास करते हैं, तो हर मुश्किल पार हो जाती है।',
    },
  },
  'story-shiva-moon': {
    'en-IN': {
      title: 'Shiva and the Quiet Crescent Moon',
      paragraphs: [
        'High in the snowy Himalayas, Little Shiva loved sitting still beside tall pine trees, listening to the gentle mountain breeze.',
        'One chilly evening, a shy crescent moon felt nervous about glowing in the dark sky. Little Shiva invited the moon to rest softly upon his topknot.',
        'Together they watched the stars twinkle peacefully, teaching the mountains the calm beauty of stillness and balance.',
      ],
      moral: 'Patience and calm stillness help everyone around us feel safe.',
    },
    'hi-IN': {
      title: 'नन्हे शिव और शीतल चंद्रमा',
      paragraphs: [
        'हिमालय की शांत वादियों में नन्हे शिव देवदार के पेड़ों के पास बैठकर धीमी हवा को सुनना पसंद करते थे।',
        'एक शाम नन्हा चंद्रमा अँधेरे आकाश में चमकने से सकुचा रहा था। शिव ने उसे स्नेह से अपनी जटाओं में स्थान दिया।',
        'दोनों ने मिलकर शांत आकाश को निहारा और सबको धैर्य व संतुलन का सुंदर पाठ सिखाया।',
      ],
      moral: 'धैर्य और शांति से हर मन सुरक्षित और प्रसन्न रहता है।',
    },
  },
  'story-radha-flute': {
    'en-IN': {
      title: 'The Flute and the Whispering Forest',
      paragraphs: [
        'In the blooming meadows of Vrindavan, Radha noticed a tiny fawn who had wandered away from its herd during twilight.',
        'With gentle words and a soothing melody, Radha comforted the frightened fawn while Krishna played soft bamboo flute notes under the kadamba tree.',
        'Following the warm music, the mother deer returned happily, thanking Radha for her patience and kind heart.',
      ],
      moral: 'Compassion and gentle listening calm even the shyest heart.',
    },
    'hi-IN': {
      title: 'राधा की करुणा और वृंदावन की बाँसुरी',
      paragraphs: [
        'वृंदावन के फूलों भरे उपवन में राधा ने देखा कि शाम के समय एक नन्हा हिरण अपने झुंड से बिछड़ गया है।',
        'राधा ने कोमल स्वर में उसे दुलारा, और कदम के पेड़ के नीचे कृष्ण ने मधुर बाँसुरी बजाई।',
        'मीठी धुन सुनकर हिरण की माँ लौट आई और उसने राधा की करुणा के लिए धन्यवाद दिया।',
      ],
      moral: 'करुणा और प्रेम से भरा हृदय सबको अपना बना लेता है।',
    },
  },
};

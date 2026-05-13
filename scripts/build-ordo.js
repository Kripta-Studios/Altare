import fs from 'fs';
import path from 'path';

const ordo = {
  "id": "ordo",
  "signumCrucis": {
    "la": "In nómine Patris, et Fílii, et Spíritus Sancti. Amen.",
    "vernacular": { "es": "En el nombre del Padre, y del Hijo, y del Espíritu Santo. Amén.", "en": "In the name of the Father, and of the Son, and of the Holy Spirit. Amen." }
  },
  "introibo": {
    "la": "Introíbo ad altáre Dei.",
    "vernacular": { "es": "Entraré al altar de Dios.", "en": "I will go in to the altar of God." }
  },
  "adDeum": {
    "la": "Ad Deum, qui lætíficat juventútem meam.",
    "vernacular": { "es": "El Dios que alegra mi juventud.", "en": "To God, the joy of my youth." }
  },
  "judicaMe": {
    "la": "Júdica me, Deus, et discérne causam meam de gente non sancta : ab hómine iníquo et dolóso érue me.\n\nQuia tu es, Deus, fortitúdo mea : quáre me repulísti, et quáre tristis incédo, dum afflígit me inimícus ?\n\nEmítte lucem tuam et veritátem tuam : ipsa me deduxérunt et adduxérunt in montem sanctum tuum, et in tabernácula tua.\n\nEt introíbo ad altáre Dei : ad Deum qui lætíficat juventútem meam.\n\nConfitébor tibi in cíthara, Deus, Deus meus : quare tristis es anima mea, et quare contúrbas me ?\n\nSpera in Deo, quóniam adhuc confitébor illi : salutáre vultus mei, et Deus meus.\n\nGlória Patri, et Filio, et Spirítui Sancto.\nSicut erat in princípio, et nunc, et semper : et in sæcula sæculórum. Amen.",
    "vernacular": {
      "es": "Júzgame, ¡oh Dios!, y distingue mi causa de la del pueblo impío: del hombre inicuo y doloso líbrame.\n\nPues Tú eres, ¡oh Dios!, mi fortaleza: ¿por qué me rechazas, y por qué ando triste, mientras me aflige el enemigo?\n\nEnvía tu luz y tu verdad: ellas me guiarán y conducirán a tu monte santo, y a tus tabernáculos.\n\nY entraré al altar de Dios: el Dios que alegra mi juventud.\n\nTe alabaré con la cítara; ¡oh Dios, Dios mío! ¿Por qué estás triste, alma mía, y por qué me conturbas?\n\nEspera en Dios, que aún le alabaré, salvación de mi faz y mi Dios.\n\nGloria al Padre, y al Hijo, y al Espíritu Santo.\nComo era en el principio, ahora y siempre, y por los siglos de los siglos. Amén.",
      "en": "Judge me, O God, and distinguish my cause from the nation that is not holy: deliver me from the unjust and deceitful man.\n\nFor Thou art God my strength: why hast Thou cast me off? and why do I go sorrowful whilst the enemy afflicteth me?\n\nSend forth Thy light and Thy truth: they have conducted me, and brought me unto Thy holy hill, and into Thy tabernacles.\n\nAnd I will go in to the altar of God: to God who giveth joy to my youth.\n\nTo Thee, O God my God, I will give praise upon the harp: why art thou sad, O my soul? and why dost thou disquiet me?\n\nHope in God, for I will still give praise to Him: the salvation of my countenance, and my God.\n\nGlory be to the Father, and to the Son, and to the Holy Ghost.\nAs it was in the beginning, is now, and ever shall be, world without end. Amen."
    }
  },
  "adjutorium": {
    "la": "Adjutórium nostrum in nómine Dómini.\nQui fecit cælum et terram.",
    "vernacular": { "es": "Nuestro auxilio está en el nombre del Señor.\nQue hizo el cielo y la tierra.", "en": "Our help is in the name of the Lord.\nWho made heaven and earth." }
  },
  "confiteorSacerdos": {
    "la": "Confíteor Deo omnipoténti, beátæ Maríæ semper Vírgini, beáto Michaéli Archángelo, beáto Joánni Baptístæ, sanctis Apóstolis Petro et Páulo, ómnibus Sanctis, et vobis, fratres : quia peccávi nimis cogitatióne, verbo, et ópere : mea culpa, mea culpa, mea máxima culpa. Ideo precor beátam Maríam semper Virginem, beátum Michaélem Archángelum, beátum Joánnem Baptístam, sanctos Apóstolos Petrum et Páulum, omnes Sanctos, et vos, fratres, oráre pro me ad Dóminum Deum nostrum.",
    "vernacular": { "es": "Me confieso a Dios omnipotente, a la bienaventurada siempre Virgen María, al bienaventurado Miguel Arcángel, al bienaventurado Juan Bautista, a los santos Apóstoles Pedro y Pablo, a todos los Santos y a ustedes, hermanos; que pequé mucho con el pensamiento, palabra, y obra, por mi culpa, por mi culpa, por mi grandísima culpa. Por tanto, ruego a la bienaventurada siempre Virgen María, al bienaventurado Miguel Arcángel, al bienaventurado Juan Bautista, a los Santos Apóstoles Pedro y Pablo, a todos los Santos, y a ustedes, hermanos, que rueguen por mí a Dios nuestro Señor." }
  },
  "misereaturSacerdos": {
    "la": "Misereátur tui omnípotens Deus, et dimissis peccátis tuis, perdúcat te ad vitam ætérnam. Amen.",
    "vernacular": { "es": "Dios omnipotente tenga misericordia de ti, y perdonados tus pecados, te lleve a la vida eterna. Amén." }
  },
  "confiteorMinistri": {
    "la": "Confíteor Deo omnipoténti, beátæ Maríæ semper Vírgini, beáto Michaéli Archángelo, beáto Joánni Baptístæ, sanctis Apóstolis Petro et Páulo, ómnibus Sanctis, et tibi pater : quia peccávi nimis cogitatióne, verbo, et ópere : mea culpa, mea culpa, mea máxima culpa. Ideo precor beátam Maríam semper Virginem, beátum Michaélem Archángelum, beátum Joánnem Baptístam, sanctos Apóstolos Petrum et Páulum, omnes Sanctos, et te, pater, oráre pro me ad Dóminum Deum nostrum.",
    "vernacular": { "es": "Me confieso a Dios omnipotente, a la bienaventurada siempre Virgen María, al bienaventurado Miguel Arcángel, al bienaventurado Juan Bautista, a los santos Apóstoles Pedro y Pablo, a todos los Santos y a ti, Padre; que pequé mucho con el pensamiento, palabra, y obra, por mi culpa, por mi culpa, por mi grandísima culpa. Por tanto, ruego a la bienaventurada siempre Virgen María, al bienaventurado Miguel Arcángel, al bienaventurado Juan Bautista, a los Santos Apóstoles Pedro y Pablo, a todos los Santos, y a ti, Padre, que ruegues por mí a Dios nuestro Señor." }
  },
  "misereaturMinistri": {
    "la": "Misereátur vestri omnípotens Deus, et dimíssis peccátis vestris, perdúcat vos ad vitam æternam. Amen.",
    "vernacular": { "es": "Dios omnipotente tenga misericordia de ustedes, y, perdonados sus pecados, los lleve a la vida eterna. Amén." }
  },
  "indulgentiam": {
    "la": "Indulgéntiam, absolutiónem, et remissiónem peccatórum nostrórum, tríbuat nobis omnípotens et miséricors Dóminus. Amen.",
    "vernacular": { "es": "Indulgencia, absolución y remisión de nuestros pecados, nos conceda el Señor omnipotente y misericordioso. Amén." }
  },
  "versicles1": {
    "la": "Deus, tu convérsus vivificábis nos.\nEt plebs tua lætábitur in te.\nOsténde nobis Dómine, misericórdiam tuam.\nEt salutáre tuum da nobis.\nDómine, exáudi oratiónem meam.\nEt clamor meus ad te véniat.\nDóminus vobíscum.\nEt cum spíritu tuo.",
    "vernacular": {
      "es": "¡Oh Dios!, vuélvete a nosotros y nos vivificarás.\nY tu pueblo se alegrará en Ti.\nMuéstranos Señor, tu misericordia.\nY danos tu salvación.\nSeñor, escucha mi oración.\nY hasta Ti mi clamor llegue.\nEl Señor sea con ustedes.\nY con tu espíritu."
    }
  },
  "auferANobis": {
    "la": "Áufer a nobis, quæsumus, Dómine, iniquitátes nostras : ut ad Sancta sanctórum puris mereámur méntibus introíre. Per Christum Dóminum nostrum. Amen.",
    "vernacular": { "es": "Retira de nosotros, Te suplicamos, Señor, nuestras iniquidades, para que merezcamos entrar con almas puras al Santo de los Santos. Por Cristo, nuestro Señor. Amén." }
  },
  "oramusTe": {
    "la": "Orámus te, Dómine, per mérita Sanctórum tuórum, quorum relíquiæ hic sunt, et ómnium Sanctórum : ut indúlgere dignéris ómnia peccáta mea. Amen.",
    "vernacular": { "es": "Te rogamos, Señor, que por los méritos de tus Santos, cuyas reliquias yacen aquí, y de todos los Santos, te dignes perdonar todos mis pecados. Amén." }
  },
  "kyrie": {
    "la": "Kýrie eléison.\nKýrie eléison.\nKýrie eléison.\nChriste eléison.\nChriste eléison.\nChriste eléison.\nKýrie eléison.\nKýrie eléison.\nKýrie eléison.",
    "vernacular": {
      "es": "Señor, ten piedad.\nSeñor, ten piedad.\nSeñor, ten piedad.\nCristo, ten piedad.\nCristo, ten piedad.\nCristo, ten piedad.\nSeñor, ten piedad.\nSeñor, ten piedad.\nSeñor, ten piedad."
    }
  },
  "gloria": {
    "la": "Glória in excélsis Deo et in terra pax homínibus bonæ voluntátis. Laudámus te. Benedícimus te. Adorámus te. Glorificámus te. Grátias ágimus tibi propter magnam glóriam tuam. Dómine Deus, Rex cœléstis, Deus Pater omnípotens. Dómine Fili unigénite, Jesu Christe. Dómine Deus, Agnus Dei, Fílius Patris. Qui tollis peccáta mundi, miserére nobis. Qui tollis peccáta mundi, súscipe deprecatiónem nostram. Qui sedes ad déxteram Patris, miserére nobis. Quóniam tu solus Sanctus. Tu solus Dóminus. Tu solus Altíssimus, Jesu Christe. Cum Sancto Spíritu in glória Dei Patris. Amen.",
    "vernacular": {
      "es": "Gloria a Dios en las alturas. Y en la tierra paz a los hombres de buena voluntad. Te alabamos. Te bendecimos. Te adoramos. Te glorificamos. Te damos gracias por tu inmensa gloria. Señor Dios, Rey de los Cielos, Dios Padre todopoderoso. Señor Hijo unigénito, Jesucristo. Señor Dios, Cordero de Dios, Hijo del Padre. Tú, que quitas los pecados del mundo, apiádate de nosotros. Tú, que quitas los pecados del mundo, acoge nuestra súplica. Tú, que estás sentado a la diestra del Padre, apiádate de nosotros. Porque Tú sólo eres Santo. Tú sólo Señor. Tú sólo Altísimo, Jesucristo. Con el Espíritu Santo en la gloria de Dios Padre. Amén."
    }
  },
  "dominusVobiscum": {
    "la": "Dóminus vobíscum.\nEt cum spíritu tuo.",
    "vernacular": { "es": "El Señor sea con vosotros.\nY con tu espíritu." }
  },
  "mundaCor": {
    "la": "Munda cor meum ac lábia mea, omnípotens Deus, qui lábia Isaíæ Prophétæ cálculo mundásti igníto : ita me tua grata miseratióne dignáre mundáre, ut sanctum Evangélium tuum digne váleam nuntiáre. Per Christum Dóminum nostrum. Amen.\n\nJube, Domine, benedícere.\n\nDóminus sit in corde meo et in lábiis meis : ut digne et competénter annúntiem Evangélium suum.",
    "vernacular": {
      "es": "Purifica mi corazón y mis labios, Dios omnipotente, que purificaste los labios del profeta Isaías con un carbón encendido; dígnate con tu grata misericordia purificarme de manera que pueda anunciar dignamente tu Santo Evangelio. Por Cristo, nuestro Señor. Amén.\n\nDame, Señor, tu bendición.\n\nEl Señor esté en mi corazón y en mis labios, para que anuncie digna y competentemente su Evangelio."
    }
  },
  "evangeliumIntro": {
    "la": "Dóminus vobíscum.\nEt cum spíritu tuo.\nSequéntia (vel Initium) sancti Evangélii secúndum N.\nGlória tibi, Dómine.",
    "vernacular": { "es": "El Señor sea con vosotros.\nY con tu espíritu.\nContinuación (o Inicio) del Santo Evangelio según N.\nGloria a Ti, Señor." }
  },
  "lausTibiChriste": {
    "la": "Laus tibi, Christe.\nPer evangélica dicta deleántur nostra delícta.",
    "vernacular": { "es": "Alabanza a Ti, Cristo.\nPor las palabras del Evangelio sean borrados nuestros delitos." }
  },
  "credo": {
    "la": "Credo in unum Deum, Patrem omnipoténtem, factórem cœli et terræ, visibílium ómnium et invisibílium. Et in unum Dóminum Jesum Christum, Fílium Dei unigénitum. Et ex Patre natum ante ómnia sæcula. Deum de Deo, lumen de lúmine, Deum verum de Deo vero. Génitum, non factum, consubstantiálem Patri : per quem ómnia facta sunt. Qui propter nos hómines, et propter nostram salútem descéndit de cœlis. Et incarnátus est de Spíritu Sancto ex María Virgine : et homo factus est. Crucifíxus etiam pro nobis ; sub Póntio Pilato passus, et sepúltus est. Et resurréxit tértia die, secúndum Scripturas. Et ascéndit in cœlum : sedet ad déxteram Patris. Et íterum ventúrus est cum glória judicare vivos et mórtuos : cujus regni non erit finis. Et in Spíritum Sanctum, Dóminum et vivificántem : qui ex Patre Filióque procédit. Qui cum Patre, et Filio simul adorátur et conglorificátur : qui locútus est per Prophétas. Et unam, sanctam, catholicam et Apostólicam Ecclésiam. Confíteor unum baptísma in remissiónem peccatórum. Et exspécto resurrectiónem mortuórum. Et vitam ventúri sæculi. Amen.",
    "vernacular": {
      "es": "Creo en un solo Dios, Padre omnipotente, Creador del cielo y de la tierra, de todo visible e invisible. Y en un solo Señor, Jesucristo, Hijo unigénito de Dios. Y nacido del Padre antes de todos los siglos. Dios de Dios, Luz de Luz, Dios verdadero de Dios verdadero. Engendrado, no hecho; consubstancial al Padre; por quien todas las cosas fueron hechas. El cual, por nosotros los hombres y por nuestra salvación, bajó de los cielos. Y por obra del Espíritu Santo se encarnó de María Virgen, y se hizo hombre. Crucificado también por nosotros, bajo el poder de Poncio Pilato, padeció y fue sepultado. Y resucitó al tercer día, conforme a las Escrituras. Y subió al cielo, está sentado a la diestra del Padre. Y otra vez ha de venir con gloria a juzgar a los vivos y a los muertos; y su Reino no tendrá fin. Y en el Espíritu Santo, Señor y vivificador, el cual procede del Padre y del Hijo. Quien con el Padre y el Hijo juntamente es adorado y glorificado; el cual habló por los Profetas. Y en la Iglesia, que es Una, Santa, Católica y Apostólica. Confieso un solo Bautismo para el perdón de los pecados. Y espero la resurrección de los muertos. Y la vida del siglo venidero. Amén."
    }
  },
  
  // NEW PARTS
  "suscripeSanctePater": {
    "la": "Súscipe, sancte Pater, omnípotens ætérne Deus, hanc immaculátam hóstiam, quam ego indígnus fámulus tuus óffero tibi, Deo meo vivo et vero, pro innumerabílibus peccátis, et offensiónibus, et negligéntiis meis, et pro ómnibus circumstántibus, sed et pro ómnibus fidélibus christiánis vivis atque defúnctis: ut mihi, et illis profíciat ad salútem in vitam ætérnam. Amen.",
    "vernacular": { "es": "Recibe, oh Padre Santo, omnipotente y eterno Dios, esta que va a ser Hostia inmaculada y que yo, indigno siervo tuyo, te ofrezco a Ti, mi Dios vivo y verdadero, por mis innumerables pecados, ofensas y negligencias, y por todos los circunstantes, así como también por todos los fieles cristianos vivos y difuntos; a fin de que a mí y a ellos nos aproveche para la salvación y vida eterna. Amen." }
  },
  "deusQuiHumanae": {
    "la": "Deus, qui humánæ substántiæ dignitátem mirabíliter condidísti, et mirabílius reformásti: da nobis per hujus aquæ et vini mystérium, ejus divinitátis esse consórtes, qui humanitátis nostræ fíeri dignátus est párticeps, Jesus Christus Fílius tuus Dóminus noster: Qui tecum vivit et regnat in unitáte Spíritus Sancti. Deus: per ómnia sǽcula sæculórum. Amen.",
    "vernacular": { "es": "Oh Dios, que maravillosamente formaste la naturaleza humana y mas maravillosamente la reformaste: haznos, por el misterio de esta agua y vino, participar de la divinidad de Aquel que se digno hacerse participante de nuestra humanidad, Jesucristo, tu Hijo Señor nuestro, que, Dios como es, contigo vive y reina en unidad del Espíritu Santo, por todos los siglos de los siglos. Amen." }
  },
  "offerimusTibi": {
    "la": "Offérimus tibi, Dómine, cálicem salutáris tuam deprecántes cleméntiam: ut in conspéctu divínæ majestátis tuæ, pro nostra, et totíus mundi salúte cum odóre suavitátis ascéndat. Amen.",
    "vernacular": { "es": "Te ofrecemos, Señor, el Cáliz de salvación, implorando de tu clemencia que llegue en olor de suavidad hasta el acatamiento de tu Divina Majestad, para nuestra salvación y la de todo el mundo. Amen." }
  },
  "inSpirituHumilitatis": {
    "la": "In spíritu humilitátis, et in ánimo contríto suscipiámur a te, Dómine, et sic fiat sacrifícium nostrum in conspéctu tuo hódie, ut pláceat tibi, Dómine Deus.\n\nVeni, sanctificátor omnípotens ætérne Deus: et bénedic hoc sacrifícium, tuo sancto nómini præparátum.",
    "vernacular": { "es": "Recíbenos, Señor, presentados a Ti con espíritu de humildad y ánimo contrito; y sea tal hoy nuestro sacrificio en tu presencia, que te sea agradable, oh Señor Dios nuestro.\n\nVen, oh Dios santificador, omnipotente y eterno, y bendice este sacrificio preparado para gloria de tu santo nombre." }
  },
  "lavabo": {
    "la": "Lavábo inter innocéntes manus meas: et circumdábo altáre tuum, Dómine: Ut áudiam vocem laudis, et enárrem univérsa mirabília tua. Dómine, diléxi decórem domus tuæ, et locum habitatiónis glóriæ tuæ. Ne perdas cum ímpiis, Deus, ánimam meam, et cum viris sánguinum vitam meam: In quorum mánibus iniquitátes sunt: déxtera eórum repléta est munéribus. Ego autem in innocéntia mea ingréssus sum: rédime me, et miserére mei. Pes meus stetit in dirécto: in ecclésiis benedícam te, Dómine. Glória Patri, et Fílio, et Spirítui Sancto. Sicut erat in princípio, et nunc, et semper: et in sǽcula sæculórum. Amen.",
    "vernacular": { "es": "Lavaré mis manos entre los inocentes; y me pondré oh Señor, al servicio de tu altar. Para hacerme eco de los cánticos de alabanza, y proclamar todas tus maravillas. Yo he amado, oh Señor, el decoro de tu casa, y la mansión de tu gloria. No pierdas, Dios mío, mi alma con los impíos, ni mi vida con los hombres sanguinarios. Cuyas manos están manchadas de maldad, y su diestra cargada de sobornos. Yo, en cambio, he procedido con inocencia; líbrame Tu y ten piedad de mi. Mi pie ha andado por el camino recto: por lo que podré alabarte, oh Señor en las asambleas de los fieles. Gloria al Padre, al Hijo y al Espíritu Santo. Como era en un principio, ahora y siempre, por los siglos de los siglos. Amen." }
  },
  "suscipeSanctaTrinitas": {
    "la": "Súscipe, sancta Trínitas, hanc oblatiónem, quam tibi offérimus ob memóriam passiónis, resurrectiónis, et ascensiónis Jesu Christi Dómini nostri: et in honórem beátæ Maríæ semper Vírginis, et beáti Joánnis Baptístæ, et sanctórum Apostolórum Petri et Pauli, et istórum, et ómnium Sanctórum: ut illis profíciat ad honórem, nobis autem ad salútem: et illi pro nobis intercédere dignéntur in cælis, quorum memóriam ágimus in terris. Per eúndem Christum Dóminum nostrum. Amen.",
    "vernacular": { "es": "Recibe, Trinidad Santa, esta oblación que te ofrecemos en memoria de la pasión, resurrección y ascensión de Nuestro Señor Jesucristo y en honor de la bienaventurada siempre Virgen Maria, del bienaventurado San Juan Bautista y de los Santos Apóstoles San Pedro y San Pablo, y de éstos y de todos los Santos; para que a ellos les sirva de honor y a nosotros nos aproveche para la salvación, y se dignen interceder por nosotros en el cielo aquellos de quienes hacemos memoria en la tierra. Por el mismo Jesucristo nuestro Señor. Amen." }
  },
  "orateFratres": {
    "la": "Oráte fratres: ut meum ac vestrum sacrifícium acceptábile fiat apud Deum Patrem omnipoténtem.\n\nSuscípiat Dóminus sacrifícium de mánibus tuis ad laudem, et glóriam nóminis sui, ad utilitátem quoque nostram, totiúsque Ecclésiæ suæ sanctæ.",
    "vernacular": { "es": "Orad, hermanos, a fin de que mi sacrificio y el vuestro, sea agradable a Dios, Padre todopoderoso.\n\nEl Señor reciba de tus manos este Sacrificio, para alabanza y gloria de su nombre, para nuestro provecho y el de toda su Santa Iglesia." }
  },
  "sursumCorda": {
    "la": "Dóminus vobíscum.\nEt cum spíritu tuo.\nSursum corda.\nHabémus ad Dóminum.\nGrátias agámus Dómino Deo nostro.\nDignum et justum est.",
    "vernacular": { "es": "El Señor sea con vosotros.\nY con tu espíritu.\n¡Arriba los corazones!\nYa los tenemos unidos al Señor.\nDemos gracias al Señor Dios nuestro.\nDigno y justo es." }
  },
  "prefaceTrinitatis": {
    "la": "Vere dignum et justum est, æquum et salutáre, nos tibi semper et ubíque grátias ágere: Dómine sancte, Pater omnípotens, ætérne Deus: Qui cum unigénito Fílio tuo, et Spíritu Sancto, unus es Deus, unus es Dóminus: non in uníus singularitáte persónæ, sed in uníus Trinitáte substántiæ. Quod enim de tua glória, revelánte te, crédimus, hoc de Fílio tuo, hoc de Spíritu Sancto, sine differéntia discretiónis sentímus. Ut in confessióne veræ sempiternǽque Deitátis, et in persónis propríetas, et in esséntia únitas, et in majestáte adorétur æquálitas. Quam laudant Ángeli atque Archángeli, Chérubim quoque ac Séraphim: qui non cessant clamáre quotídie, una voce dicéntes:",
    "vernacular": { "es": "Verdaderamente es digno y justo, equitativo y saludable, que te demos gracias en todo tiempo y lugar ¡oh Señor Santo, Padre todopoderoso y eterno Dios! Quien, con tu Hijo unigénito y el Espíritu Santo, eres un solo Dios, eres un solo Señor: no en la unidad de una sola persona, sino en la Trinidad de una sola sustancia. Porque cuanto creemos, por habérnoslo Tu revelado, acerca de tu gloria, creémoslo igualmente de tu Hijo, y del Espíritu Santo, sin haber diferencia ni separación. De modo que, al reconocer una sola verdadera y eterna Divinidad, sea también adorada la propiedad en las personas, la unidad en la esencia y la igualdad en la majestad. A la cual alaban los Ángeles y los Arcángeles, los Querubines y los Serafines, que no cesan de cantar diariamente, diciendo a coro:" }
  },
  "sanctus": {
    "la": "Sanctus, Sanctus, Sanctus, Dóminus Deus Sábaoth. Pleni sunt cæli et terra glória tua. Hosánna in excélsis. Benedíctus qui venit in nómine Dómini. Hosánna in excélsis.",
    "vernacular": { "es": "Santo, Santo, Santo, es el Señor Dios de los Ejércitos. Llenos están los cielos y la Tierra de tu gloria. Hosanna en las alturas. Bendito el que viene en nombre del Señor. Hosanna en las alturas." }
  },
  "teIgitur": {
    "la": "Te ígitur, clementíssime Pater, per Jesum Christum Fílium tuum, Dóminum nostrum, súpplices rogámus, ac pétimus uti accépta hábeas, et benedícas, hæc dona, hæc múnera, hæc sancta sacrifícia illibáta, in primis, quæ tibi offérimus pro Ecclésia tua sancta cathólica: quam pacificáre, custodíre, adunáre, et régere dignéris toto orbe terrárum: una cum fámulo tuo Papa nostro N., et Antístite nostro N. et ómnibus orthodóxis, atque cathólicæ et apostólicæ fidei cultóribus.",
    "vernacular": { "es": "Te pedimos, pues, y humildemente te rogamos, oh Padre clementísimo, por nuestro Señor Jesucristo, tu Hijo, que recibas y bendigas estos dones, estas ofrendas y estos santos y puros sacrificios; que te ofrecemos, en primer lugar, por tu Santa Iglesia católica, para que te dignes darle la paz, guardarla, unificarla, y gobernarla en toda la redondez de la tierra, juntamente con tu ciervo el Papa N., nuestro Prelado N., y todos los que profesan la verdadera fe católica y apostólica." }
  },
  "mementoVivi": {
    "la": "Meménto, Dómine, famulórum, famularúmque tuárum N. et N. et ómnium circumstántium, quorum tibi fides cógnita est, et nota devótio, pro quibus tibi offérimus: vel qui tibi ófferunt hoc sacrifícium laudis, pro se, suísque ómnibus: pro redemptióne animárum suárum, pro spe salútis et incolumitátis suæ: tibíque reddunt vota sua ætérno Deo, vivo et vero.",
    "vernacular": { "es": "Acuérdate, Señor, de tus siervos y siervas N. y N. y de todos los circunstantes, cuya fe y devoción te son conocidos; por los que te ofrecemos, o que ellos mismos te ofrecen, este sacrificio de alabanza, por sí y por todos los suyos, por el rescate de sus almas, y por su salud y bienestar corporal; y que también te tributan sus homenajes a Ti, Dios eterno." }
  },
  "communicantes": {
    "la": "Communicántes, et memóriam venerántes, in primis gloriósæ semper Vírginis Maríæ, Genitrícis Dei et Dómini nostri Jesu Christi: sed et beáti Joseph, ejúsdem Vírginis Sponsi, et beatórum Apostolórum ac Mártyrum tuórum, Petri et Pauli, Andréæ, Jacóbi, Joánnis, Thomæ, Jacóbi, Philíppi, Bartholomǽi, Matthǽi, Simónis, et Thaddǽi: Lini, Cleti, Cleméntis, Xysti, Cornélii, Cypriáni, Lauréntii, Chrysógoni, Joánnis et Pauli, Cosmæ et Damiáni, et ómnium Sanctórum tuórum; quorum méritis precibúsque concédas, ut in ómnibus protectiónis tuæ muniámur auxílio. Per eúndem Christum Dóminum nostrum. Amen.",
    "vernacular": { "es": "Unidos por la comunión de los Santos y honrando, primeramente, la memoria de la gloriosa siempre Virgen María, Madre de Jesucristo, Señor y Dios nuestro, y la de tus bienaventurados Apóstoles y Mártires: Pedro y Pablo, Andrés, Santiago, Juan, Tomás, Santiago, Felipe, Bartolomé, Mateo, Simón y Tadeo, Lino, Clemente, Sixto, Cornelio, Cipriano, Lorenzo, Crisogono, Juan y Pablo, Cosme y Damián, y de todos tus Santos; te pedimos, por sus meritos e intercesión, nos concedas ser fortalecidos en todo con el auxilio de tu protección. Por el mismo Jesucristo nuestro Señor. Amen." }
  },
  "hancIgitur": {
    "la": "Hanc ígitur oblatiónem servitútis nostræ, sed et cunctæ famíliæ tuæ, quǽsumus, Dómine, ut placátus accípias: diésque nostros in tua pace dispónas, atque ab ætérna damnatióne nos éripi, et in electórum tuórum júbeas grege numerári. Per Christum Dóminum nostrum. Amen.",
    "vernacular": { "es": "Por lo mismo, Señor, te rogamos te dignes admitir favorablemente esta ofrenda en testimonio de nuestra dependencia y de toda tu familia: y hacer que pasemos, en paz contigo, los días de nuestra vida, que nos veamos libres de la condenación eterna y seamos por Ti incluidos en el número de tus escogidos. Por Jesucristo nuestro Señor. Amen." }
  },
  "quamOblationem": {
    "la": "Quam oblatiónem tu, Deus, in ómnibus, quǽsumus, benedíctam, adscríptam, ratam, rationábilem, acceptabilémque fácere dignéris: ut nobis Corpus, et Sanguis fiat dilectíssimi Fílii tui Dómini nostri Jesu Christi.",
    "vernacular": { "es": "La cual ofrenda, suplicámoste, oh Dios, te dignes ordenar sea bendita, aprobada, confirmada, razonable y agradable: de suerte que se convierta, para nuestro provecho, en el Cuerpo y Sangre de tu muy amado Hijo Jesucristo nuestro Señor." }
  },
  "quiPridie": {
    "la": "Qui prídie quam paterétur, accépit panem in sanctas, ac venerábiles manus suas, et elevátis óculis in cælum ad te Deum Patrem suum omnipoténtem, tibi grátias agens, benedíxit, fregit, dedítque discípulis suis, dicens:\nAccípite, et manducáte ex hoc omnes,\nHOC EST ENIM CORPUS MEUM.",
    "vernacular": { "es": "El cual, la víspera de su pasión, tomó un pan en sus santas y venerables manos, y levantando los ojos al cielo en dirección a ti, oh Dios, su padre omnipotente, dándote las gracias, lo bendijo, lo partió u se lo dio a sus discípulos, diciendo: tomad y comed todos de él:\nPORQUE ÉSTE ES MI CUERPO." }
  },
  "similiModo": {
    "la": "Símili modo postquam cænátum est, accípiens et hunc præclárum Cálicem in sanctas ac venerábiles manus suas: item tibi grátias agens, benedíxit, dedítque discípulis suis, dicens:\nAccípite, et bíbite ex eo omnes,\nHIC EST ENIM CALIX SÁNGUINIS MEI, NOVI ET ÆTÉRNI TESTAMÉNTI: MYSTÉRIUM FÍDEI: QUI PRO VOBIS ET PRO MULTIS EFFUNDÉTUR IN REMISSIÓNEM PECCATÓRUM.\nHæc quotiescúmque fecéritis, in mei memóriam faciétis.",
    "vernacular": { "es": "De igual modo, al terminar la cena tomó también este precioso cáliz en sus santas y venerables manos, y dándote de nuevo gracias, lo bendijo, y se lo dio a sus discípulos, diciendo: tomad y bebed todos de él:\nPORQUE ÉSTE ES EL CÁLIZ DE MI SANGRE, DEL NUEVO Y ETERNO TESTAMENTO: MISTERIO DE FE: QUE SERÁ DERRAMADA POR VOSOTROS Y POR MUCHOS EN REMISIÓN DE LOS PECADOS.\nCuantas veces hiciereis esto, hacedlo en memoria de mi." }
  },
  "undeEtMemores": {
    "la": "Unde et mémores, Dómine, nos servi tui, sed et plebs tua sancta, ejúsdem Christi Fílii tui Dómini nostri tam beátæ passiónis, nec non et ab ínferis resurrectiónis, sed et in cælos gloriósæ ascensiónis: offérimus præcláræ majestáti tuæ de tuis donis, ac datis, hóstiam puram, hóstiam sanctam, hóstiam immaculátam, Panem sanctum vitæ ætérnæ, et Cálicem salútis perpétuæ.",
    "vernacular": { "es": "Por lo cual, oh Señor, acordándonos nosotros tus siervos y tu pueblo santo, así de la dichosa Pasión de tu mismo Hijo y Señor nuestro Jesucristo, como de su resurrección del sepulcro, y de su gloriosa Ascensión a los cielos: ofrecemos a tu Majestad, de entre tus dones y dádivas, una Hostia pura, una Hostia santa, una Hostia inmaculada, el Pan santo de la vida eterna y el Cáliz de perpetua salvación." }
  },
  "supraQuae": {
    "la": "Supra quæ propítio ac seréno vultu respícere dignéris; et accépta habére, sícuti accépta habére dignátus es múnera púeri tui justi Abel, et sacrifícium Patriárchæ nostri Ábrahæ: et quod tibi óbtulit summus sacérdos tuus Melchísedech, sanctum sacrifícium, immaculátam hóstiam.",
    "vernacular": { "es": "Sobre las cuales ofrendas dígnate mirar con ojos favorables y semblante apacible, y aceptarlas como tuviste a bien aceptar los dones de tu siervo el inocente Abel, y es Sacrificio de nuestro Patriarca Abrahán, así como también el que te ofreció tu Sumo Sacerdote Melquisedec: sacrificio aquel santo, hostia inmaculada." }
  },
  "supplicesTeRogamus": {
    "la": "Súpplices te rogámus, omnípotens Deus: jube hæc perférri per manus sancti Ángeli tui in sublíme altáre tuum, in conspéctu divínæ majestátis tuæ: ut quotquot, ex hac altáris participatióne sacrosánctum Fílii tui, Corpus, et Sánguinem sumpsérimus, omni benedictióne cælésti et grátia repleámur. Per eúndem Christum Dóminum nostrum. Amen.",
    "vernacular": { "es": "Humildemente te suplicamos, oh Dios todopoderoso, que mandes transportar estas ofrendas por manos de tu santo Ángel a tu altar celestial y hasta el acatamiento de tu divina Majestad: a fin de que todos cuantos, comulgando en este altar, recibiéremos el santo Cuerpo y la Sangre de tu Hijo, seamos colmados de todas las bendiciones y gracias celestiales. Por el mismo Jesucristo nuestro Señor. Amen." }
  },
  "mementoDefuncti": {
    "la": "Meménto étiam, Dómine, famulórum, famularúmque tuarum N. et N. qui nos præcessérunt cum signo fídei, et dórmiunt in somno pacis. Ipsis, Dómine, et ómnibus in Christo quiescéntibus, locum refrigérii, lucis et pacis, ut indúlgeas, deprecámur. Per eúndem Christum Dóminum nostrum. Amen.",
    "vernacular": { "es": "Acuérdate también, Señor, de tus siervos y siervas N. y N. Que nos han precedido con la señal de la fe y duermen el sueno de la paz. A ellos, oh Señor, y a todos los que descansan en Cristo, rogamoste los coloques en el lugar del refrigerio, de la luz y de la paz. Por el mismo Jesucristo nuestro Señor. Amen." }
  },
  "nobisQuoque": {
    "la": "Nobis quoque peccatóribus fámulis tuis, de multitúdine miseratiónum tuárum sperántibus, partem áliquam, et societátem donáre dignéris, cum tuis sanctis Apóstolis et Martýribus: cum Joánne, Stéphano, Matthía, Bárnaba, Ignátio, Alexándro, Marcellíno, Petro, Felicitáte, Perpétua, Ágatha, Lúcia, Agnéte, Cæcília, Anastásia, et ómnibus Sanctis tuis: intra quorum nos consórtium, non æstimátor mériti, sed véniæ, quǽsumus, largítor admítte. Per Christum Dóminum nostrum.",
    "vernacular": { "es": "También a nosotros, tus siervos pecadores, que confiamos en la abundancia de tu misericordia, dígnate darnos participación y entrada con tus Santos Apóstoles y Mártires: con Juan, Esteban, Matías, Bernabé, Ignacio, Alejandro, Marcelino, Pedro, Felicidad, Perpetua, Águeda, Lucía, Inés, Cecilia, Anastasia, y todos tus Santos: en cuya compañía te rogamos nos admitas, no en atención a nuestros meritos, sino por tu gran misericordia. Por Jesucristo nuestro Señor. Amen." }
  },
  "perQuem": {
    "la": "Per quem hæc ómnia, Dómine, semper bona creas, sanctíficas, vivíficas, benedícis, et præstas nobis. Per ipsum, et cum ipso, et in ipso, est tibi Deo Patri omnipoténti, in unitáte Spíritus Sancti, omnis honor, et glória. Per ómnia sǽcula sæculórum. Amen.",
    "vernacular": { "es": "Por quien siempre produces, oh Señor, todos estos bienes, los santificas, los vivificas, los bendices y nos los otorgas. Por él y con él y en él a ti, Dios Padre omnipotente, en unión con el Espíritu Santo, se dirige todo honor y gloria. Por todos los siglos de los siglos. Amen." }
  },
  "paterNoster": {
    "la": "Orémus. Præcéptis salutáribus móniti, et divína institutióne formáti, audémus dícere:\n\nPater noster, qui es in cælis: Sanctificétur nomen tuum: Advéniat regnum tuum: Fiat volúntas tua, sicut in cælo, et in terra. Panem nostrum quotidiánum da nobis hódie: Et dimítte nobis débita nostra, sicut et nos dimíttimus debitóribus nostris. Et ne nos indúcas in tentatiónem:\nSed líbera nos a malo. Amen.",
    "vernacular": { "es": "Oremos. Teniendo en cuenta la orden del Señor y aleccionados por el divino Maestro, nos atrevemos a exclamar:\n\nPadre nuestro, que estás en los cielos. Santificado sea tu nombre. Venga a nosotros tu reino. Hágase tu voluntad así en la tierra como en el cielo. El pan nuestro de cada día dánoslo hoy y perdónanos nuestras deudas, así como nosotros perdonamos a nuestros deudores. Y no nos dejes caer en la tentación,\nMas líbranos del mal. Amen." }
  },
  "liberaNos": {
    "la": "Líbera nos, quǽsumus, Dómine, ab ómnibus malis, prætéritis, præséntibus, et futúris: et intercedénte beáta et gloriósa semper Vírgine Dei Genitríce María, cum beátis Apóstolis tuis Petro et Paulo, atque Andréa, et ómnibus Sanctis, da propítius pacem in diébus nostris: ut ope misericórdiæ tuæ adjúti, et a peccáto simus semper líberi et ab omni perturbatióne secúri. Per eúndem Dóminum nostrum Jesum Christum Fílium tuum. Qui tecum vivit et regnat in unitáte Spíritus Sancti, Deus, per ómnia sǽcula sæculórum. Amen.",
    "vernacular": { "es": "Líbranos, Señor, de todos los males pasados, presentes y futuros; y por la intercesión de la gloriosa siempre Virgen Maria, Madre de Dios, y de tus bienaventurados Apóstoles San Pedro, San Pablo y San Andrés, y todos los demás Santos danos bondadosamente la paz en nuestros días; a fin de que, asistidos con el auxilio de Tu misericordia, estemos siempre libres de pecado y al abrigo de cualquier perturbación. Por el mismo Jesucristo, Señor nuestro e Hijo tuyo, que, Dios como es, contigo vive y reina en unidad del Espíritu Santo. Por los siglos de los siglos. Amen." }
  },
  "paxDomini": {
    "la": "Pax Dómini sit semper vobíscum.\nEt cum spíritu tuo.",
    "vernacular": { "es": "La paz del Señor sea siempre con vosotros.\nY con tu espíritu." }
  },
  "haecCommixtio": {
    "la": "Hæc commíxtio, et consecrátio Córporis et Sánguinis Dómini nostri Jesu Christi fiat accipiéntibus nobis in vitam ætérnam. Amen.",
    "vernacular": { "es": "Esta mezcla y consagración del Cuerpo y Sangre de Nuestro Señor Jesucristo nos aproveche a nosotros para la vida eterna. Amen." }
  },
  "agnusDei": {
    "la": "Agnus Dei, qui tollis peccáta mundi: miserére nobis.\nAgnus Dei, qui tollis peccáta mundi: miserére nobis.\nAgnus Dei, qui tollis peccáta mundi: dona nobis pacem.",
    "vernacular": { "es": "Cordero de Dios que quitas los pecados del mundo, ¡ten misericordia de nosotros!\nCordero de Dios que quitas los pecados del mundo, ¡ten misericordia de nosotros!\nCordero de Dios que quitas los pecados del mundo, ¡danos la paz!" }
  },
  "domineJesuChristeQuiDixisti": {
    "la": "Dómine Jesu Christe, qui dixísti Apóstolis tuis: Pacem relínquo vobis, pacem meam do vobis: ne respícias peccáta mea, sed fidem Ecclésiæ tuæ: eámque secúndum voluntátem tuam pacificáre et coadunáre dignéris: Qui vivis et regnas Deus per ómnia sǽcula sæculórum. Amen.",
    "vernacular": { "es": "Señor Jesucristo, que dijiste a tus Apóstoles: Mi paz os dejo, mi paz os doy; no te fijes en mis pecados, sino en la fe de tu Iglesia, a la cual dígnate pacificarla y unirla conforme a tu voluntad. Tú que vives y reinas por todos los siglos de los siglos. Amen." }
  },
  "domineJesuChristeFiliDei": {
    "la": "Dómine Jesu Christe, Fili Dei vivi, qui ex voluntáte Patris, cooperánte Spíritu Sancto, per mortem tuam mundum vivificásti: líbera me per hoc sacrosánctum Corpus et Sánguinem tuum ab ómnibus iniquitátibus meis, et univérsis malis: et fac me tuis semper inhærére mandátis, et a te numquam separári permíttas: Qui cum eódem Deo Patre et Spíritu Sancto vivis et regnas Deus in sǽcula sæculórum. Amen.",
    "vernacular": { "es": "Oh Señor Jesucristo, Hijo de Dios vivo, que por voluntad del Padre y con la cooperación del Espíritu Santo, diste la vida al mundo por tu muerte: líbrame, por tu sagrado Cuerpo y Sangre de todas mis iniquidades y de todos los demás males, y haz que cumpla siempre tus mandamientos y no permitas que jamás me aparte de Ti, quien siendo Dios, vives y reinas con el mismo Dios Padre y con el Espíritu Santo, Por los siglos de los siglos. Amen." }
  },
  "perceptioCorporis": {
    "la": "Percéptio Córporis tui, Dómine Jesu Christe, quod ego indígnus súmere præsúmo, non mihi provéniat in judícium et condemnatiónem: sed pro tua pietáte prosit mihi ad tutaméntum mentis et córporis, et ad medélam percipiéndam: Qui vivis et regnas cum Deo Patre in unitáte Spíritus Sancti, Deus, per ómnia sǽcula sæculórum. Amen.",
    "vernacular": { "es": "La comunión de tu Cuerpo, Señor Jesucristo, que yo indigno me atrevo a recibir ahora, no se me convierta en motivo de juicio y condenación; sino que, por tu misericordia, me sirva de protección para alma y para cuerpo y de medicina saludable. Tú, que siendo Dios, vives y reinas con Dios Padre en unidad del Espíritu Santo, por los siglos de los siglos. Amen." }
  },
  "panemCaelestem": {
    "la": "Panem cæléstem accípiam, et nomen Dómini invocábo.\n\nDómine, non sum dignus, ut intres sub tectum meum: sed tantum dic verbo, et sanábitur ánima mea.\nDómine, non sum dignus, ut intres sub tectum meum: sed tantum dic verbo, et sanábitur ánima mea.\nDómine, non sum dignus, ut intres sub tectum meum: sed tantum dic verbo, et sanábitur ánima mea.",
    "vernacular": { "es": "Recibiré el Pan celestial, e invocare el Nombre del Señor.\n\nSeñor, yo no soy digno de que entres en mi pobre morada, mas di una sola palabra y mi alma se salvará.\nSeñor, yo no soy digno de que entres en mi pobre morada, mas di una sola palabra y mi alma se salvará.\nSeñor, yo no soy digno de que entres en mi pobre morada, mas di una sola palabra y mi alma se salvará." }
  },
  "corpusDomini": {
    "la": "Corpus Dómini nostri Jesu Christi custódiat ánimam meam in vitam ætérnam. Amen.",
    "vernacular": { "es": "El Cuerpo de Nuestro Señor Jesucristo guarde mi alma para la vida eterna. Amen." }
  },
  "quidRetribuam": {
    "la": "Quid retríbuam Dómino pro ómnibus quæ retríbuit mihi? Cálicem salutáris accípiam, et nomen Dómini invocábo. Laudans invocábo Dóminum, et ab inimícis meis salvus ero.\n\nSanguis Dómini nostri Jesu Christi custódiat ánimam meam in vitam ætérnam. Amen.",
    "vernacular": { "es": "¿Con qué corresponderé yo al Señor por todo cuanto El me ha dado? Sumiré el Cáliz de salvación e invocaré al Señor con cánticos de alabanza, y me pondré a salvo de mis enemigos.\n\nLa Sangre de Nuestro Señor Jesucristo guarde mi alma para la vida eterna. Amen." }
  },
  "ecceAgnusDei": {
    "la": "Ecce Agnus Dei, ecce qui tollit peccáta mundi.\n\nDómine, non sum dignus, ut intres sub tectum meum: sed tantum dic verbo, et sanábitur ánima mea.\nDómine, non sum dignus, ut intres sub tectum meum: sed tantum dic verbo, et sanábitur ánima mea.\nDómine, non sum dignus, ut intres sub tectum meum: sed tantum dic verbo, et sanábitur ánima mea.",
    "vernacular": { "es": "Ved aquí el Cordero de Dios, ved aquí al que quita los pecados del mundo.\n\nSeñor, yo no soy digno de que entres en mi pobre morada, mas di una sola palabra y mi alma será salva.\nSeñor, yo no soy digno de que entres en mi pobre morada, mas di una sola palabra y mi alma será salva.\nSeñor, yo no soy digno de que entres en mi pobre morada, mas di una sola palabra y mi alma será salva." }
  },
  "corpusDominiPopulo": {
    "la": "Corpus Dómini nostri Jesu Christi custódiat ánimam tuam in vitam ætérnam. Amen.",
    "vernacular": { "es": "El Cuerpo de Nuestro Señor Jesucristo guarde tu alma para la vida eterna. Amen." }
  },
  "quodOre": {
    "la": "Quod ore súmpsimus, Dómine, pura mente capiámus: et de múnere temporáli fiat nobis remédium sempitérnum.",
    "vernacular": { "es": "Lo que hemos recibido, Señor, con la boca, acójanoslo con alma pura; y este don temporal se convierta para nosotros en remedio sempiterno." }
  },
  "corpusTuum": {
    "la": "Corpus tuum, Dómine, quod sumpsi, et Sanguis, quem potávi, adhǽreat viscéribus meis: et præsta; ut in me non remáneat scélerum mácula, quem pura et sancta refecérunt sacraménta: Qui vivis et regnas in sǽcula sæculórum, Amen.",
    "vernacular": { "es": "Tu Cuerpo Señor, que he comido, y tu sangre que he bebido, se adhieran a mis entrañas; y haz que ni mancha de pecado quede ya en mi, después de haber sido alimentado con un tan santo y tan puro Sacramento: Tu que vives y reinas por los siglos de los siglos. Amen." }
  },
  "iteMissaEst": {
    "la": "Dóminus vobíscum.\nEt cum spíritu tuo.\n\nIte, Missa est. (vel Benedicámus Dómino)\nDeo grátias.",
    "vernacular": { "es": "El Señor sea con vosotros.\nY con tu espíritu.\n\nPodéis ir en paz. (O Bendigamos al Señor)\nDemos gracias a Dios." }
  },
  "placeatTibi": {
    "la": "Pláceat tibi, sancta Trínitas, obséquium servitútis meæ: et præsta; ut sacrifícium, quod óculis tuæ majestátis indígnus óbtuli, tibi sit acceptábile, mihíque et ómnibus pro quibus illud óbtuli, sit, te miseránte, propitiábile. Per Christum Dóminum nostrum. Amen.",
    "vernacular": { "es": "Plázcate, Trinidad Santa, el obsequio de mi servicio; y concédeme que este sacrificio que yo, indigno, he ofrecido a los ojos de tu Majestad, te sea aceptable, y me sirva, por tu misericordia, de propiciación para mí y para todos aquellos por quienes lo he ofrecido. Por Jesucristo Nuestro Señor. Amen." }
  },
  "benedicatVos": {
    "la": "Benedícat vos omnípotens Deus, Pater, et Fílius, et Spíritus Sanctus. Amen.",
    "vernacular": { "es": "Os bendiga Dios todopoderoso, Padre, Hijo, y Espíritu Santo. Amen." }
  },
  "initiumEvangelii": {
    "la": "Dóminus vobíscum.\nEt cum spíritu tuo.\n\nInítium sancti Evangélii secúndum Joánnem.\nGlória tibi, Dómine.\n\nIn princípio erat Verbum, et Verbum erat apud Deum, et Deus erat Verbum. Hoc erat in princípio apud Deum. Ómnia per ipsum facta sunt: et sine ipso factum est nihil, quod factum est: in ipso vita erat, et vita erat lux hóminum: et lux in ténebris lucet, et ténebræ eam non comprehendérunt. Fuit homo missus a Deo, cui nomen erat Joánnes. Hic venit in testimónium, ut testimónium perhibéret de lúmine, ut omnes créderent per illum. Non erat ille lux, sed ut testimónium perhibéret de lúmine. Erat lux vera, quæ illúminat omnem hóminem veniéntem in hunc mundum. In mundo erat, et mundus per ipsum factus est, et mundus eum non cognóvit. In própria venit, et sui eum non recepérunt. Quotquot autem recepérunt eum, dedit eis potestátem fílios Dei fíeri, his qui credunt in nómine ejus: qui non ex sanguínibus, neque ex voluntáte carnis, neque ex voluntáte viri, sed ex Deo nati sunt.\n\nET VERBUM CARO FACTUM EST et habitávit in nobis: et vídimus glóriam ejus, glóriam quasi Unigéniti a Patre, plenum grátiæ et veritátis.\n\nDeo grátias.",
    "vernacular": {
      "es": "El Señor sea con vosotros.\nY con tu espíritu.\n\nInicio del santo Evangelio según San Juan.\nGloria a Ti, Señor.\n\nEn el principio existía el Verbo, y el Verbo estaba con Dios, y el Verbo era Dios. Él estaba en el principio con Dios. Todas las cosas fueron hechas por Él, y sin Él nada de lo que ha sido hecho, fue hecho. En Él estaba la vida, y la vida era la luz de los hombres. La luz brilla en las tinieblas, y las tinieblas no la comprendieron. Hubo un hombre enviado de Dios, el cual se llamaba Juan. Este vino para dar testimonio, para dar testimonio de la luz, a fin de que todos creyesen por él. No era él la luz, sino el que debía dar testimonio de la luz. El Verbo era la luz verdadera, que ilumina a todo hombre que viene a este mundo. En el mundo estaba, y el mundo fue hecho por Él, y el mundo no lo conoció. Vino a su propia casa, y los suyos no lo recibieron. Pero a todos los que lo recibieron, a los que creen en su nombre, les dio potestad de ser hechos hijos de Dios; los cuales no son engendrados de sangre, ni de voluntad de carne, ni de voluntad de varón, sino de Dios.\n\nY EL VERBO SE HIZO CARNE y habitó entre nosotros: y vimos su gloria, gloria como del Unigénito del Padre, lleno de gracia y de verdad.\n\nDemos gracias a Dios."
    }
  }
};

fs.writeFileSync(path.join(process.cwd(), 'public/data/ordinary/ordo.json'), JSON.stringify(ordo, null, 2));

# thanks:
#   QQ Group: 主群-基岩版开发者交流 - User: 萝卜~
#   for providing the test cases

# xxx
/scoreboard objectives add xxx dummy
/scoreboard objectives add xxx dummy
/scoreboard objectives add xxx dummy


# xxxidxxx
/scoreboard players set @e xxx 88888
/scoreboard players set @e xxx 1
/scoreboard players operation xxx xxx -= xx xxx
/scoreboard players operation @p xxx = xxx xxx

# xxx
/tag @s add xxx
/title @a[tag=xxx,scores={xxx=..999}] title §l§cxxx§axxx§bxxx
/tag @a[scores={xxx=..999}] remove xxx
/title @a[tag=xxx,scores={xxx=1000..}] title §l§bxxx§exxx§dxxx§axxx
/tag @a[scores={xxx=1000..},tag=xxx] add xxx
/execute @a[tag=xxx] ~ ~ ~ summon armor_stand ~ ~ ~
/execute @a[tag=xxx] ~ ~ ~ tag @e[type=armor_stand,c=1] add xxx
/scoreboard players remove @a[tag=xxx] 1000
/tag @a[tag=xxx] remove xxx


# xxx
/execute @e[tag=xxx] ~ ~ ~ tp @s ~ ~ ~1
/scoreboard players add @e[tag=xxx] xxx 1
/execute @e[tag=xxx] ~ ~ ~ fill ~ 5 ~ ~61 250 ~ ender_chest 0 replace bedrock 0
/execute @e[tag=xxx] ~ ~ ~ fill ~ 5 ~ ~61 250 ~ replace bedrock 0 ender_chest 0
/title @a[tag=xxx] title §l§dxxx§bxxx§cxxx§axxx
/tag @a[tag=xxx] remove xxx
/kill @e[tag=xxx]
/scoreboard players test @e[tag=xxx] xxx 61 61
/kill @e[tag=xxx]
/execute @a[tag=xxx] ~ ~ ~ summon armor_stand ~30 ~-8 ~31
/execute @a[tag=xxx] ~ ~ ~ clone 10001 141 10103 10061 151 10163 ~ ~-11 ~
/execute @a[tag=xxx] ~ ~ ~ scoreboard players operation @e[x=~30,y=~-9,z=~31,dy=3,type=armor_stand] xxxid = @s xxxid
/title @a[tag=xxx] title §l§bxxx
/tag @a remove xxx

# xxx
/execute @e[x=~-2,y=~,z=~-5,dy=2,type=armor_stand] ~ ~ ~ execute @a[x=~-30,y=~-100,z=~-30,dx=60,dy=350,dz=60] ~ ~ ~ scoreboard players operation @s xxx = @s xxxid
/execute @e[x=~-1,y=~,z=~-5,dy=2,type=armor_stand] ~ ~ ~ execute @a[x=~-30,y=~-100,z=~-30,dx=60,dy=350,dz=60] ~ ~ ~ scoreboard players operation @s xxx -= @e[scores={xxxid=1..},c=1,type=armor_stand] xxxid
/execute @e[x=~-2,y=~-2,z=~-5,dy=2,type=armor_stand] ~ ~ ~ gamemode 2 @a[x=~-30,y=~-100,z=~-30,dx=60,dy=350,dz=60,scores={xxx=!0},m=0]
/execute @e[x=~-1,y=~-2,z=~-5,dy=2,type=armor_stand] ~ ~ ~ gamemode 0 @a[x=~-30,y=~-100,z=~-30,dx=60,dy=350,dz=60,scores={xxx=0},m=2]

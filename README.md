# flashfile
A specification for a FlashInvader exchange format


The street artist known as *Invader* disposes mosaics originaly inspired by 8 bit videogames all over tgh world.
The mosaics can be "flashed" and collected in a smartphone application called FlashInvaders.

It is currently not possible to exchange or export the flashed mosaic

The FlashFile format is a compact format to describe lists of items that can be mosaics.

## Items
Every item has a unique name in the LOCATION[_ORDER] format.
Examples : NY_100 PA_01,27 PA_1500, SPACE_02


## specification
The format is text based and is a list of token, separated by spaces or newlines.
There can be comments starting from position 0 in a line or within a line provided all tokens in the line are valid.
Comments start with a #  and the line content after does not contribute to tokens 
Tokens are case-insensistive but it is recommended to use capitals
Each token describes one or many item.

Example

''code
# this is valid
PA_1299 LA_18 # MARS_19 is not in the list

There are 4 types of tokens

### Tokens with location

1 - TK_29
this token describes a single item and can be anywhere in the file
the token id build using a location, the _ (underscore) and a number.
numbers lower than 10 are expected to be padded with "0" but it is not mandatory
example: TK_28 HK_04

This token not only describes an item but sets the *implicit location* to its location, and the
*implicit mode* to *add*

2 - DIJ
This token describes all items in a location, it also  sets the *implicit location* to its location and the 
implicit mode* to *remove*.

### Position
Positions can be 
1 - absolute: a single number maps to a single item.
exemple LDN_24 56
When a Position token is encountered, the *implicit location* is used to resolve its location

2 - series: two numbers separated by a , (comma) depicting a contiguous range (including bounds)
exemple: RA_17,20 23,26

They can be part of a token with location or be a token on their own.


### implicit location and implicit mode
The implicit location decides what Location a position token is attributed to.
The implicit location is reset to itself by any of the Location tokens 
exemple
FTBL_17
20,22 # means # FTBL_20 FTBL_21 FTBL_22
AMS_12
18    # means # AMS_18

The implicit mode decides if the mosaic described must be added or removed from the 
*implicit location*

#Exemple:
ROM_03         # add ROM_03 to the list, sets ROM as the implicit location and ADD implicit mode
19 27,29    # adds ROM_05 ROM_27 ROM_28 ROM_29 to the list
DIJ         # adds DIJ_01 DIJ_02 DIJ_04 DIJ_05 DIJ_06
04           # removes DIJ_04

### issue with implicit mode
This mode allow for very short description of "all" items in a location but the concept of "all" 
is a moving target, as the number of referenced items might increase. Invader usually proceeds in "waves",
with a (sometimes large amount of mosaics is added to an already invaded location.

This means the token describes a situation at a moment in time and that the number of items in the location must be known at the time.
if the number of items is likely to very the use of location only tokens is discouraged.

# application to FlashInvaders lists

This format allows for very concise description of mosaic flashed in the world, because of the possibility
to describe missing items from an otherwise complete list and series of contiguous order, wit also the implicit
mode saving lot of space.

The compression ratio is vey higfh compared to a "flat" list of every item

Paris is under constant "invasion" and the total number of referenced mosaics increases very often so the use of 
As the mosaics are in the street and are often destroyed or not flashable, these token should be used with caution.

It happens that LIL (Lille) is the only invaded location in the world to have its order number start at 0 instead of 1.
An application will need to take care of this to resolve correctly LIL as LIL_00,05

#  usage

FlashFiles are optimized for FlashInvaders but can be used for any Location Order application.

The format is still very readable while beeing so concise.
Any list in the form of complete location is a valid FlashFile

They can be encoded in a QRCode as an URL and shared or sent in mails or messages.








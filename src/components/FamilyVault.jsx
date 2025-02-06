"use client"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, UserPlus, Heart } from "lucide-react"
import { JsonRpcClient } from "@calimero-network/calimero-client"
import { getNodeUrl, getConfigAndJwt } from "@/helpers/helper"

function FamilyPictureVaultApp() {
  const [familyMembers, setFamilyMembers] = useState([])

  const [newMemberName, setNewMemberName] = useState("")

  useEffect(() => {
    const loadAllData = async () => {
      const rpcClient = new JsonRpcClient(
        getNodeUrl(),
        '/jsonrpc',
      );

      const { jwtObject, config, error } = getConfigAndJwt();
      if (error) {
        return { error };
      }
      // Execute a method
      const response = await rpcClient.execute({
        contextId: jwtObject.context_id,
        method: "get_all_entries",
        argsJson: {},
        executorPublicKey: jwtObject.executor_public_key,
      },
        config,
      );
      if (response.error) {
        return;
      }
      const data = response.result.output;
      for (let i = 0; i < data.length; i++) {
        data[i]["id"] = i;
      }
      console.log(data);
      setFamilyMembers(data);
    }
    loadAllData();
  }, [])


  const addFamilyMember = async () => {
    if (newMemberName.trim()) {
      const rpcClient = new JsonRpcClient(
        getNodeUrl(),
        '/jsonrpc',
      );
      console.log(1)
      const { jwtObject, config, error } = getConfigAndJwt();
      if (error) {
        return { error };
      }
      console.log(2)
      // Execute a method
      const response = await rpcClient.execute({
        contextId: jwtObject.context_id,
        method: "add_name",
        argsJson: { username: newMemberName.trim() },
        executorPublicKey: jwtObject.executor_public_key,
      },
        config,
      );
      console.log(3)
      console.log(response);
      if (response.error) {
        return;
      }
      console.log(4)


      setFamilyMembers([
        ...familyMembers,
        {
          id: Date.now().toString(),
          username: newMemberName.trim(),
          images: [],
        },
      ])
      setNewMemberName("")
    }
  }

  const uploadImage = async (memberName, newPicture) => {
    const rpcClient = new JsonRpcClient(
      getNodeUrl(),
      '/jsonrpc',
    );

    const { jwtObject, config, error } = getConfigAndJwt();
    if (error) {
      return { error };
    }
    // Execute a method
    const response = await rpcClient.execute({
      contextId: jwtObject.context_id,
      method: "add_image",
      argsJson: { username: memberName, image: newPicture },
      executorPublicKey: jwtObject.executor_public_key,
    },
      config,
    );
    console.log(response)
    if (response.error) {
      return;
    }

    
  }

  const uploadNewPicture = async (memberName) => {
    // give code that firsts load the image from user
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (event) => {
      const file = event.target.files[0];
      if (!file) {
        return
      }
      const reader = new FileReader();
      reader.onload = async(e) => {
        const newPicture = e.target.result;

        const uploadResponse = await uploadImage(memberName, newPicture);
        console.log(uploadResponse)
        setFamilyMembers(
          familyMembers.map((member) =>
            member.username == memberName
              ? { ...member, images: [...member.images, newPicture] }
              : member
          )
        );
      };
      reader.readAsDataURL(file);
    }
  input.click();
};

return (
  <div className="space-y-8">
    <Tabs defaultValue={familyMembers.length > 0 ? familyMembers[0].id : "Name"} className="w-full">
      <TabsList className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2 bg-blue-50 p-1 rounded-xl">
        { familyMembers.map((member) => (
          <TabsTrigger
            key={member.id}
            value={member.id}
            className="data-[state=active]:bg-white data-[state=active]:text-blue-800 rounded-lg transition-all"
          >
            {member.username}
          </TabsTrigger>
        ))}
      </TabsList>
      {familyMembers.map((member) => (
        <TabsContent key={member.id} value={member.id}>
          <Card className="bg-white shadow-lg rounded-xl overflow-hidden">
            <CardHeader className="bg-blue-800 text-white">
              <CardTitle className="text-2xl">{member.username}'s Album</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {member.images.map((pic, index) => (
                  <div key={index} className="relative aspect-square group">
                    <img
                      src={pic || "/placeholder.svg"}
                      alt={`${member.username}'s picture ${index + 1}`}
                      className="object-cover w-full h-full rounded-lg transition-all duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 rounded-lg flex items-center justify-center">
                      <Heart className="text-white opacity-0 group-hover:opacity-100 transition-all duration-300" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="bg-gray-50">
              <Button onClick={() => uploadNewPicture(member.username)} className="w-full bg-blue-800 hover:bg-blue-700">
                <Upload className="mr-2 h-4 w-4" /> Upload New Picture
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      ))}
    </Tabs>

    <Card className="bg-white shadow-lg rounded-xl overflow-hidden">
      <CardHeader className="bg-green-800 text-white">
        <CardTitle className="text-2xl">Add New Family Member</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex items-center space-x-2">
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="newMember" className="text-gray-700">
              Name
            </Label>
            <Input
              type="text"
              id="newMember"
              value={newMemberName}
              onChange={(e) => setNewMemberName(e.target.value)}
              placeholder="Enter name"
              className="border-gray-300 focus:border-green-500 focus:ring-green-500"
            />
          </div>
          <Button onClick={addFamilyMember} className="mt-6 bg-green-800 hover:bg-green-700">
            <UserPlus className="mr-2 h-4 w-4" /> Add Member
          </Button>
        </div>
      </CardContent>
    </Card>
  </div>
)
}

export default FamilyPictureVaultApp


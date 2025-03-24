
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { KeywordConfig } from "@/lib/types";
import { Edit, Trash, Search, Plus, AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";

interface KeywordTableProps {
  keywords: KeywordConfig[];
  onAdd: () => void;
  onEdit: (keywordId: string) => void;
  onDelete: (keywordId: string) => void;
}

export const KeywordTable: React.FC<KeywordTableProps> = ({
  keywords,
  onAdd,
  onEdit,
  onDelete,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [keywordToDelete, setKeywordToDelete] = useState<string | null>(null);

  const confirmDelete = (id: string) => {
    // Check if it's a default keyword
    const keywordConfig = keywords.find(k => k.id === id);
    if (keywordConfig?.isDefault) {
      toast({
        title: "Cannot delete default keyword",
        description: "Default keywords cannot be deleted, but they can be modified.",
        variant: "destructive",
      });
      return;
    }
    
    setKeywordToDelete(id);
  };

  const handleDelete = () => {
    if (keywordToDelete) {
      onDelete(keywordToDelete);
      setKeywordToDelete(null);
      
      toast({
        title: "Keyword deleted",
        description: "The keyword and its responses have been removed.",
      });
    }
  };

  const cancelDelete = () => {
    setKeywordToDelete(null);
  };

  const filteredKeywords = keywords.filter(
    (k) =>
      k.keyword.toLowerCase().includes(searchTerm.toLowerCase()) ||
      k.variations.some((v) =>
        v.text.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  return (
    <>
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
        <div className="relative w-full md:w-auto md:flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search keywords..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <Button onClick={onAdd} className="w-full md:w-auto">
          <Plus className="h-4 w-4 mr-2" /> Add Keyword
        </Button>
      </div>

      {filteredKeywords.length > 0 ? (
        <div className="rounded-md border animate-fade-in">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[250px]">Keyword</TableHead>
                <TableHead>Variations</TableHead>
                <TableHead className="w-[250px]">Response Preview</TableHead>
                <TableHead className="w-[100px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredKeywords.map((config) => (
                <TableRow key={config.id} className="group">
                  <TableCell className="font-medium">
                    {config.keyword}
                    {config.isDefault && (
                      <span className="ml-2 inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">
                        Default
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    {config.variations.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {config.variations.map((v) => (
                          <span
                            key={v.id}
                            className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-800"
                          >
                            {v.text}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-sm">None</span>
                    )}
                  </TableCell>
                  <TableCell className="max-w-[250px] truncate">
                    {config.responses[0]?.text || "No response configured"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(config.id)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => confirmDelete(config.id)}
                        disabled={config.isDefault}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : searchTerm ? (
        <div className="flex flex-col items-center justify-center py-12 text-center animate-fade-in">
          <Search className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">No results found</h3>
          <p className="text-muted-foreground mt-2">
            No keywords matching "{searchTerm}" found.
          </p>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center border rounded-md animate-fade-in">
          <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">No keywords configured</h3>
          <p className="text-muted-foreground mt-2 mb-6">
            Get started by adding a new keyword.
          </p>
          <Button onClick={onAdd}>
            <Plus className="h-4 w-4 mr-2" /> Add Keyword
          </Button>
        </div>
      )}

      <Dialog open={!!keywordToDelete} onOpenChange={() => setKeywordToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Keyword</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this keyword? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={cancelDelete}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
